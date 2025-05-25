<?php

class ReviewController {
    private $db;
    private $userRewardModel;

    public function __construct() {
        global $db;
        $this->db = $db;
        $this->userRewardModel = new UserReward();
    }

    /**
     * 口コミを投稿する
     */
    public function postReview() {
        // ユーザー認証チェック
        $auth = new Auth();
        $user = $auth->getCurrentUser();
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => '認証が必要です']);
            return;
        }
        
        // リクエストデータを取得
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => '無効なリクエスト']);
            return;
        }
        
        // バリデーション
        if (empty($data['entityType']) || empty($data['entityId']) || !isset($data['rating']) || empty($data['comment'])) {
            http_response_code(400);
            echo json_encode(['error' => '必須項目が不足しています']);
            return;
        }
        
        $entityType = $data['entityType']; // 'doctor' または 'hospital'
        $entityId = $data['entityId'];
        $rating = (int)$data['rating'];
        $comment = $data['comment'];
        $tags = isset($data['tags']) ? $data['tags'] : [];
        
        // レビュー投稿処理
        try {
            $sql = "INSERT INTO reviews (user_id, entity_type, entity_id, rating, comment, created_at) 
                    VALUES (?, ?, ?, ?, ?, NOW())";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([$user['id'], $entityType, $entityId, $rating, $comment]);
            
            if (!$result) {
                throw new Exception('レビュー投稿に失敗しました');
            }
            
            $reviewId = $this->db->lastInsertId();
            
            // タグの処理
            if (!empty($tags)) {
                $tagValues = [];
                $tagPlaceholders = [];
                
                foreach ($tags as $index => $tag) {
                    $tagValues[] = $reviewId;
                    $tagValues[] = $tag;
                    $tagPlaceholders[] = "(?, ?)";
                }
                
                $tagSql = "INSERT INTO review_tags (review_id, tag) VALUES " . implode(', ', $tagPlaceholders);
                $tagStmt = $this->db->prepare($tagSql);
                $tagStmt->execute($tagValues);
            }
            
            // ポイントとバッジの処理
            $rewards = $this->userRewardModel->processReviewReward($user['id']);
            
            // 投稿成功レスポンス
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'レビューを投稿しました',
                'reviewId' => $reviewId,
                'rewards' => $rewards
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * 口コミに「いいね」を付ける
     */
    public function likeReview() {
        // ユーザー認証チェック
        $auth = new Auth();
        $user = $auth->getCurrentUser();
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => '認証が必要です']);
            return;
        }
        
        // リクエストデータを取得
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['reviewId'])) {
            http_response_code(400);
            echo json_encode(['error' => '無効なリクエスト']);
            return;
        }
        
        $reviewId = $data['reviewId'];
        
        try {
            // 既に「いいね」をしているか確認
            $checkSql = "SELECT COUNT(*) as count FROM review_likes WHERE user_id = ? AND review_id = ?";
            $checkStmt = $this->db->prepare($checkSql);
            $checkStmt->execute([$user['id'], $reviewId]);
            $exists = (int)$checkStmt->fetch()['count'] > 0;
            
            if ($exists) {
                // 既に「いいね」がある場合は削除（トグル機能）
                $sql = "DELETE FROM review_likes WHERE user_id = ? AND review_id = ?";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([$user['id'], $reviewId]);
                
                echo json_encode([
                    'success' => true,
                    'liked' => false,
                    'message' => '「いいね」を取り消しました'
                ]);
            } else {
                // 「いいね」を追加
                $sql = "INSERT INTO review_likes (user_id, review_id, created_at) VALUES (?, ?, NOW())";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([$user['id'], $reviewId]);
                
                // レビュー投稿者にポイントを付与
                $getAuthorSql = "SELECT user_id FROM reviews WHERE id = ?";
                $authorStmt = $this->db->prepare($getAuthorSql);
                $authorStmt->execute([$reviewId]);
                $authorResult = $authorStmt->fetch();
                
                if ($authorResult) {
                    $authorId = $authorResult['user_id'];
                    // 自分以外のレビューに「いいね」した場合のみポイント付与
                    if ($authorId != $user['id']) {
                        $this->userRewardModel->addUserPoints($authorId, 2); // いいねされると2ポイント
                    }
                }
                
                echo json_encode([
                    'success' => true,
                    'liked' => true,
                    'message' => '「いいね」を追加しました'
                ]);
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * 有用な口コミタグを取得
     */
    public function getPopularTags() {
        $entityType = isset($_GET['entityType']) ? $_GET['entityType'] : null;
        
        if (!$entityType) {
            http_response_code(400);
            echo json_encode(['error' => '無効なリクエスト']);
            return;
        }
        
        try {
            $sql = "SELECT tag, COUNT(*) as count 
                    FROM review_tags rt
                    JOIN reviews r ON rt.review_id = r.id 
                    WHERE r.entity_type = ?
                    GROUP BY tag 
                    ORDER BY count DESC 
                    LIMIT 10";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$entityType]);
            $tags = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'tags' => $tags
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * ユーザーのポイントとバッジを取得
     */
    public function getUserRewards() {
        // ユーザー認証チェック
        $auth = new Auth();
        $user = $auth->getCurrentUser();
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => '認証が必要です']);
            return;
        }
        
        try {
            $points = $this->userRewardModel->getUserPoints($user['id']);
            $badges = $this->userRewardModel->getUserBadges($user['id']);
            
            echo json_encode([
                'success' => true,
                'points' => $points,
                'badges' => $badges
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
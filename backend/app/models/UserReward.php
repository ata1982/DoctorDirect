<?php

class UserReward extends BaseModel {
    protected $table = 'user_rewards';
    protected $resultKey = 'rewards';

    /**
     * ユーザーのポイントを取得
     * @param int $userId ユーザーID
     * @return int ポイント数
     */
    public function getUserPoints($userId) {
        $sql = "SELECT points FROM user_points WHERE user_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        
        $result = $stmt->fetch();
        return $result ? (int)$result['points'] : 0;
    }

    /**
     * ユーザーのポイントを追加
     * @param int $userId ユーザーID
     * @param int $points 追加ポイント数
     * @return bool 成功/失敗
     */
    public function addUserPoints($userId, $points) {
        // ポイントが既に存在するか確認
        $currentPoints = $this->getUserPoints($userId);
        
        if ($currentPoints > 0) {
            // 既存のポイントを更新
            $sql = "UPDATE user_points SET points = points + ? WHERE user_id = ?";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$points, $userId]);
        } else {
            // 新規ポイントを作成
            $sql = "INSERT INTO user_points (user_id, points) VALUES (?, ?)";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([$userId, $points]);
        }
    }

    /**
     * ユーザーのバッジを取得
     * @param int $userId ユーザーID
     * @return array バッジリスト
     */
    public function getUserBadges($userId) {
        $sql = "SELECT b.* FROM user_badges ub 
                JOIN badges b ON ub.badge_id = b.id 
                WHERE ub.user_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        
        return $stmt->fetchAll();
    }

    /**
     * ユーザーにバッジを付与
     * @param int $userId ユーザーID
     * @param int $badgeId バッジID
     * @return bool 成功/失敗
     */
    public function addUserBadge($userId, $badgeId) {
        // 既に持っているバッジか確認
        $sql = "SELECT COUNT(*) as count FROM user_badges WHERE user_id = ? AND badge_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId, $badgeId]);
        $result = $stmt->fetch();
        
        if ((int)$result['count'] > 0) {
            return true; // 既に持っている
        }
        
        // バッジを付与
        $sql = "INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$userId, $badgeId]);
    }

    /**
     * レビュー投稿に対するポイント付与とバッジチェック
     * @param int $userId ユーザーID
     * @return array 付与されたポイントとバッジの情報
     */
    public function processReviewReward($userId) {
        $result = [
            'points' => 10, // 基本ポイント
            'badges' => []
        ];
        
        // ポイント付与
        $this->addUserPoints($userId, $result['points']);
        
        // バッジチェック
        // レビュー数を取得
        $sql = "SELECT COUNT(*) as count FROM reviews WHERE user_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        $reviewCount = (int)$stmt->fetch()['count'];
        
        // 初回レビューバッジ
        if ($reviewCount === 1) {
            $this->addUserBadge($userId, 1); // 1: レビューデビュー
            $result['badges'][] = [
                'id' => 1,
                'name' => 'レビューデビュー',
                'description' => '初めてのレビューを投稿しました'
            ];
        }
        
        // 10件達成バッジ
        if ($reviewCount === 10) {
            $this->addUserBadge($userId, 2); // 2: 信頼レビュアー
            $result['badges'][] = [
                'id' => 2,
                'name' => '信頼レビュアー',
                'description' => '10件のレビューを投稿しました'
            ];
        }
        
        return $result;
    }
}
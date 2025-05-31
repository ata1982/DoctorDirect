import { cn, log, LogLevel, AppError } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })
  })

  describe('log function', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    afterEach(() => {
      consoleSpy.mockClear()
    })

    it('logs info messages', () => {
      log(LogLevel.INFO, 'Test message')
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'))
    })

    it('logs with context', () => {
      log(LogLevel.INFO, 'Test message', { key: 'value' })
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'))
    })
  })

  describe('AppError', () => {
    it('creates error with message and status code', () => {
      const error = new AppError('Test error', 400)
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(400)
    })

    it('defaults to 500 status code', () => {
      const error = new AppError('Test error')
      expect(error.statusCode).toBe(500)
    })
  })
})
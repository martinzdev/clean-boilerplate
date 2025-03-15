/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type Post {
 *  id: string
 *  title: string
 *  content: string
 * }
 *
 * Optional<Post, 'id' | 'email'>
 * ```
 */

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

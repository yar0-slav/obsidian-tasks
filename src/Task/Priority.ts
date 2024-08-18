/**
 * When sorting, make sure low always comes after none. This way any tasks with low will be below any exiting
 * tasks that have no priority which would be the default.
 *
 * Values can be converted to strings with:
 * - {@link priorityNameUsingNone} in {@link PriorityTools}
 * - {@link priorityNameUsingNormal} in {@link PriorityTools}
 *
 * @export
 * @enum {number}
 */
export enum Priority {
    Goal = '0',
    P1 = '1',
    P2 = '2',
    P3 = '3',
    P4 = '4',
    None = '5',
}

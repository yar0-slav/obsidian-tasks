import { Priority } from '../Task/Priority';

export class PriorityTools {
    /**
     * Get the name of a {@link Priority} value, returning 'None' for {@link Priority.None}
     * @param priority
     * @see priorityNameUsingNormal
     */
    public static priorityNameUsingNone(priority: Priority) {
        let priorityName = 'ERROR';
        switch (priority) {
            case Priority.Goal:
                priorityName = 'Goal';
                break;
            case Priority.P1:
                priorityName = 'P1';
                break;
            case Priority.P2:
                priorityName = 'P2';
                break;
            case Priority.P3:
                priorityName = 'P3';
                break;
            case Priority.P4:
                priorityName = 'P4';
                break;
            case Priority.None:
                priorityName = 'None';
                break;
        }
        return priorityName;
    }

    /**
     * Get the name of a {@link Priority} value, returning 'Normal' for {@link Priority.None}
     * @param priority
     * @see priorityNameUsingNone
     */
    public static priorityNameUsingNormal(priority: Priority) {
        return PriorityTools.priorityNameUsingNone(priority).replace('None', 'P3');
    }
}

import type { Task } from '../../Task/Task';
import { Explanation } from '../Explain/Explanation';
import type { Comparator } from '../Sort/Sorter';
import type { GrouperFunction } from '../Group/Grouper';
import { Priority } from '../../Task/Priority';
import { Field } from './Field';
import { Filter } from './Filter';
import { FilterOrErrorMessage } from './FilterOrErrorMessage';

export class PriorityField extends Field {
    // The trick in the following to manage whitespace with optional values
    // is to capture them in Nested Capture Groups, like this:
    //  (leading-white-space-in-outer-capture-group(values-to-use-are-in-inner-capture-group))
    // The capture groups are numbered in the order of their opening brackets, from left to right.
    private static readonly priorityRegexp = /^priority(\s+is)?(\s+(above|below|not))?(\s+(none|p4|p3|p2|p1|goal))$/i;

    createFilterOrErrorMessage(line: string): FilterOrErrorMessage {
        const priorityMatch = Field.getMatch(this.filterRegExp(), line);
        if (priorityMatch !== null) {
            const filterPriorityString = priorityMatch[5];
            let filterPriority: Priority | null = null;

            switch (filterPriorityString.toLowerCase()) {
                case 'none':
                    filterPriority = Priority.None;
                    break;
                case 'P4':
                    filterPriority = Priority.P4;
                    break;
                case 'P3':
                    filterPriority = Priority.P3;
                    break;
                case 'P2':
                    filterPriority = Priority.P2;
                    break;
                case 'P1':
                    filterPriority = Priority.P1;
                    break;
                case 'Goal':
                    filterPriority = Priority.Goal;
                    break;
            }

            if (filterPriority === null) {
                return FilterOrErrorMessage.fromError(line, 'do not understand priority');
            }

            let explanation = line;
            let filter;
            switch (priorityMatch[3]?.toLowerCase()) {
                case 'above':
                    filter = (task: Task) => task.priority.localeCompare(filterPriority!) < 0;
                    break;
                case 'below':
                    filter = (task: Task) => task.priority.localeCompare(filterPriority!) > 0;
                    break;
                case 'not':
                    filter = (task: Task) => task.priority !== filterPriority;
                    break;
                default:
                    filter = (task: Task) => task.priority === filterPriority;
                    explanation = `${this.fieldName()} is ${filterPriorityString}`;
            }

            return FilterOrErrorMessage.fromFilter(new Filter(line, filter, new Explanation(explanation)));
        } else {
            return FilterOrErrorMessage.fromError(line, 'do not understand query filter (priority)');
        }
    }

    public fieldName(): string {
        return 'priority';
    }

    protected filterRegExp(): RegExp {
        return PriorityField.priorityRegexp;
    }

    public supportsSorting(): boolean {
        return true;
    }

    public comparator(): Comparator {
        return (a: Task, b: Task) => {
            return a.priority.localeCompare(b.priority);
        };
    }

    public supportsGrouping(): boolean {
        return true;
    }

    public grouper(): GrouperFunction {
        return (task: Task) => {
            return [task.priorityNameGroupText];
        };
    }
}

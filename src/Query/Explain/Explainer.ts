import { getSettings } from '../../Config/Settings';
import type { Query } from '../Query';

export class Explainer {
    /**
     * Generate a text description of the contents of a query.
     *
     * This does not show any global filter and global query.
     * Use {@link explainResults} if you want to see any global query and global filter as well.
     */
    public explainQuery(query: Query) {
        if (query.error !== undefined) {
            return this.explainError(query);
        }

        /**
         * Each function result should:
         * - either:
         *     - be empty, if there is no information,
         * - or:
         *     - begin with a non-newline,
         *     - end with a single newline.
         */
        const results: string[] = [];
        results.push(this.explainFilters(query));
        results.push(this.explainGroups(query));
        results.push(this.explainQueryLimits(query));
        results.push(this.explainDebugSettings());

        return results.filter((explanation) => explanation !== '').join('\n');
    }

    private explainError(query: Query) {
        let result = '';
        result += 'Query has an error:\n';
        result += query.error + '\n';
        return result;
    }

    public explainFilters(query: Query) {
        const numberOfFilters = query.filters.length;
        if (numberOfFilters === 0) {
            return 'No filters supplied. All tasks will match the query.\n';
        }

        return query.filters
            .map((filter) => {
                return filter.explainFilterIndented('');
            })
            .join('\n');
    }

    public explainGroups(query: Query) {
        const numberOfGroups = query.grouping.length;
        if (numberOfGroups === 0) {
            return 'No grouping instructions supplied.\n';
        }

        let result = '';
        for (let i = 0; i < numberOfGroups; i++) {
            result += query.grouping[i].instruction + '\n';
        }
        return result;
    }

    public explainQueryLimits(query: Query) {
        function getPluralisedText(limit: number) {
            let text = `At most ${limit} task`;
            if (limit !== 1) {
                text += 's';
            }
            return text;
        }

        const results: string[] = [];

        if (query.limit !== undefined) {
            const result = getPluralisedText(query.limit) + '.\n';
            results.push(result);
        }

        if (query.taskGroupLimit !== undefined) {
            const result =
                getPluralisedText(query.taskGroupLimit) + ' per group (if any "group by" options are supplied).\n';
            results.push(result);
        }
        return results.join('\n');
    }

    private explainDebugSettings() {
        let result = '';
        const { debugSettings } = getSettings();
        if (debugSettings.ignoreSortInstructions) {
            result +=
                "NOTE: All sort instructions, including default sort order, are disabled, due to 'ignoreSortInstructions' setting.\n";
        }
        return result;
    }
}

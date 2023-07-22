import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { merge, Observable, of as observableOf } from 'rxjs';

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDatasource<TModel> extends DataSource<TModel> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(public readonly data: TModel[]) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TModel[]> {
    const data$ = observableOf(this.data);

    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(data$, this.paginator.page, this.sort.sortChange).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    }
    return data$;
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    /* left blank */
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TModel[]): TModel[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TModel[]): TModel[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      if (!isRecord(a)) return 0;
      if (!isRecord(b)) return 0;

      const isAsc = this.sort?.direction === 'asc';

      // Extracting as much information of the model as possible in order to provide
      // automatic sorting capabilities
      // const model = this.data[0];
      const modelProperties = Object.keys(a);

      const sortingKey = this.sort?.active || '';
      const isSortingKeyMatchingAModelProperty = modelProperties.includes(sortingKey);

      if (!isSortingKeyMatchingAModelProperty) return 0;

      const actual = a[sortingKey];
      const comparing = b[sortingKey];

      if (typeof actual === 'string' && typeof comparing === 'string')
        return compare(actual, comparing, isAsc);

      if (typeof actual === 'number' && typeof comparing === 'number')
        return compare(actual, comparing, isAsc);

      return 0;
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return !!candidate || typeof candidate === 'object';
}

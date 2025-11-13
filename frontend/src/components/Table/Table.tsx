import React, { ReactElement, ReactNode } from "react";

import styles from "../../styles/components/Table.module.scss";

interface TableProps<T> {
  columns: Array<{
    accessor: keyof T;
    header: ReactNode;
    cell?: (value: T[keyof T], record: T, rowIndex: number) => ReactNode;
    align?: "left" | "center" | "right";
    width?: string | number;
  }>;
  data: T[];
  className?: string;
  rowKey?: (record: T) => React.Key;
  emptyPlaceholder?: ReactNode;
  onRowClick?: (record: T, rowIndex: number) => void;
  loading?: boolean;
}

export const Table = <T,>({
	columns,
	data,
	className,
	rowKey,
	emptyPlaceholder,
	onRowClick,
	loading = false,
	...restProps
}: TableProps<T>): ReactElement => {
	const isEmpty = data.length === 0;

	const getRowKey = (record: T, index: number): React.Key => {
		return rowKey ? rowKey(record) : index;
	};

	const handleRowClick = (record: T, rowIndex: number) => {
		if (onRowClick) {
			onRowClick(record, rowIndex);
		}
	};

	const renderCellContent = (
		column: TableProps<T>["columns"][number],
		record: T,
		rowIndex: number,
	): ReactNode => {
		const value = record[column.accessor];
		if (column.cell) {
			return column.cell(value, record, rowIndex);
		}
		return value as ReactNode;
	};

	const getColumnWidth = (width?: string | number): string | undefined => {
		if (width === undefined) return undefined;
		return typeof width === "number" ? `${width}px` : width;
	};

	return (
		<div
			className={`${styles.Table} ${className || ""} ${loading ? styles.Table_loading : ""}`}
			{...restProps}
		>
			<div className={styles.Table__wrapper}>
				<table className={styles.Table__table}>
					<thead className={styles.Table__thead}>
						<tr className={styles.Table__row}>
							{columns.map((column, index) => (
								<th
									key={`header-${String(column.accessor)}-${index}`}
									className={styles.Table__th}
									data-align={column.align || "left"}
									style={{ width: getColumnWidth(column.width) }}
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className={styles.Table__tbody}>
						{isEmpty && !loading && (
							<tr className={styles.Table__emptyRow}>
								<td colSpan={columns.length} className={styles.Table__emptyCell}>
									{emptyPlaceholder || <span className={styles.Table__empty}>No data</span>}
								</td>
							</tr>
						)}
						{loading && (
							<>
								{[...Array(5)].map((_, idx) => (
									<tr key={`skeleton-${idx}`} className={`${styles.Table__row} ${styles.Table__row_skeleton}`}>
										{columns.map((column, colIdx) => (
											<td
												key={`skeleton-cell-${idx}-${colIdx}`}
												className={styles.Table__td}
												data-align={column.align || "left"}
											>
												<div className={styles.Table__skeleton} />
											</td>
										))}
									</tr>
								))}
							</>
						)}
						{!loading &&
              data.map((record, rowIndex) => (
              	<tr
              		key={getRowKey(record, rowIndex)}
              		className={`${styles.Table__row} ${onRowClick ? styles.Table__row_clickable : ""}`}
              		onClick={() => handleRowClick(record, rowIndex)}
              		tabIndex={onRowClick ? 0 : undefined}
              		role={onRowClick ? "button" : undefined}
              		onKeyDown={(e) => {
              			if (onRowClick && (e.key === "Enter" || e.key === " ")) {
              				e.preventDefault();
              				handleRowClick(record, rowIndex);
              			}
              		}}
              	>
              		{columns.map((column, colIndex) => (
              			<td
              				key={`cell-${String(column.accessor)}-${colIndex}`}
              				className={styles.Table__td}
              				data-align={column.align || "left"}
              			>
              				{renderCellContent(column, record, rowIndex)}
              			</td>
              		))}
              	</tr>
              ))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

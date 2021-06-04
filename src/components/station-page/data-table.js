import React from 'react';
import { useTable, useSortBy, usePagination, useExpanded } from 'react-table';
import { IconArrowNarrowDown, IconArrowNarrowUp, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons';
import { dataTable, paginationContainer, paginationButton, paginationSelect, selectWrapper, navigationWrapper } from './data-table.module.css';


export default function DataTable({ columns, data, initialState, renderRowSubComponent }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        //rows,
        prepareRow,
        visibleColumns,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable(
        { 
            columns, 
            data,
            initialState 
        }, 
        useSortBy,
        useExpanded,
        usePagination
    )

    return (
        <React.Fragment>
            <table {...getTableProps()} className={dataTable}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}{' '}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? <IconArrowNarrowDown size={16} color="#5d5d5d" stroke={2} /> : <IconArrowNarrowUp size={16} color="#5d5d5d" stroke={2} />) : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row)
                        const rowProps = row.getRowProps()
                        return (
                            <React.Fragment key={rowProps.key}>
                                <tr {...rowProps}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Sub-component */}
                                {row.isExpanded &&
                                    renderRowSubComponent({ row, rowProps, visibleColumns })}
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
            <div className={paginationContainer}>
                <div className={selectWrapper}>
                    <select className={paginationSelect} value={pageSize} onChange={e => { setPageSize(Number(e.target.value)) }}>
                        {[10, 20, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={navigationWrapper}>
                    <button className={paginationButton} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        <IconChevronsLeft size={18} color="#5d5d5d" stroke={2} />
                    </button>{' '}
                    <button className={paginationButton} onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <IconChevronLeft size={17} color="#5d5d5d" stroke={2} />
                    </button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>
                    </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <button className={paginationButton} onClick={() => nextPage()} disabled={!canNextPage}>
                        <IconChevronRight size={17} color="#5d5d5d" stroke={2} />
                    </button>{' '}
                    <button className={paginationButton} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        <IconChevronsRight size={18} color="#5d5d5d" stroke={2} />
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}
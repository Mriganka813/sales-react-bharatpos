import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, usePagination } from "react-table";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/allSales.scss';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AllSales = ({ keySales }) => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [searchClicked, setSearchClicked] = useState(false);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8001/api/v1/report?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}&type=sale`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setData(response.data.sales);
                console.log(response.data.sales);
            } catch (error) {
                toast.error("Error fetching sales");
            }
        };

        if (searchClicked || keySales) {
            fetchData();
            setSearchClicked(false); // Reset searchClicked after fetching data
        }
    }, [startDate, endDate, searchClicked, keySales, token]);


    const columns = React.useMemo(
        () => [
            {
                Header: "Date",
                accessor: "date"
            },
            {
                Header: "InvoiceNumber",
                accessor: "invoiceNum"
            },
            {
                Header: "Products",
                accessor: "orderItems",
                Cell: ({ cell: { value } }) => (
                    <ul>
                        {value.map((item, index) => (
                            <li key={index}>{item.product ? item.product.name : ""}</li>
                        ))}
                    </ul>
                )
            },
            {
                Header: "Total",
                accessor: "total"
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        state: { pageIndex },
        pageCount,
        gotoPage
    } = useTable(
        {
            columns,
            data,
            initialState: { pageSize: 20 }
        },
        useSortBy,
        usePagination
    );

    const handleSearchClick = () => {
        setSearchClicked(true);
    };

    return (
        <div className="container">
            <div className="date-picker-container">
                <div className="date-picker">
                    <span>Start Date: </span>
                    <DatePicker className="date" selected={startDate} onChange={date => setStartDate(date)} />
                </div>
                <div className="date-picker">
                    <span>End Date: </span>
                    <DatePicker className="date" selected={endDate} onChange={date => setEndDate(date)} />
                </div>
            </div>

            <button onClick={handleSearchClick} className='sale-search'>Search</button>

            {data.length === 0 ? (
                <div>No Data to show</div>
            ) : (
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup, idx) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                                {headerGroup.headers.map((column, idx2) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={idx2}>
                                        {column.render("Header")}
                                        {column.isSorted && <span>{column.isSortedDesc ? <AiOutlineSortDescending /> : <AiOutlineSortAscending />}</span>}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, idx) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={idx}>
                                    {row.cells.map((cell, idx2) => (
                                        <td {...cell.getCellProps()} key={idx2}>
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <div className='table-buttons'>
                <button disabled={pageIndex === 0} onClick={() => gotoPage(0)}>First</button>
                <button disabled={!canPreviousPage} onClick={previousPage}>Prev</button>
                <span>
                    {pageIndex + 1} of {pageCount}
                </span>
                <button disabled={!canNextPage} onClick={nextPage}>Next</button>
                <button disabled={pageIndex === pageCount - 1} onClick={() => gotoPage(pageCount - 1)}>Last</button>
            </div>
        </div >
    );
};

export default AllSales;

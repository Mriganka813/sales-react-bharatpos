import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/home.scss';
import { FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from "react-table";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";

const Home = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [searchClicked, setSearchClicked] = useState(false);
    // const [invoiceNumber, setInvoiceNumber] = useState('');
    const [salesKey, setSalesKey] = useState(0); // Key to force re-render of AllSales
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [navigate, token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://testbackend-u2af.onrender.com/api/v1/report?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}&type=sale`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setData(response.data.sales);
                // console.log(response.data.sales);
            } catch (error) {
                toast.error("Error fetching sales");
            }
        };

        if (searchClicked || salesKey) {
            fetchData();
            setSearchClicked(false); // Reset searchClicked after fetching data
        }
    }, [startDate, endDate, searchClicked, salesKey, token]);

    const handleDeleteSales = async (invoiceNumber) => {

        const confirmed = window.confirm("Are you sure you want to delete this sale?");
        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `https://testbackend-u2af.onrender.com/api/v1/sale/${invoiceNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Sales deleted successfully");
            setSalesKey(prevKey => prevKey + 1);
            // setInvoiceNumber('');
        } catch (error) {
            // console.log(error)
            toast.error('Error deleting sales');
        }
    };

    function extractTimeFromISOString(dateString) {
        // Create a Date object from the ISO 8601 formatted string
        const date = new Date(dateString);

        // Extract hours, minutes, and seconds
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();

        // Format hours, minutes, and seconds with leading zeros if necessary
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return formattedTime;
    }

    const handleSearchClick = () => {
        setSearchClicked(true);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "Date",
                accessor: "date",
                Cell: ({ cell: { value } }) => {
                    const date = new Date(value);
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            },
            {
                Header: "Time",
                accessor: "time",
                Cell: ({ row }) => (
                    extractTimeFromISOString(row.original.date)
                )
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
                accessor: "total",
                Cell: ({ cell: { value } }) => (
                    value.toFixed(2)
                )
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <button onClick={() => handleDeleteSales(row.original.invoiceNum)} className='action-delete'>
                        <FaTrash />
                    </button>
                )
            }
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


    const handleLogout = () => {
        Cookies.remove('token');
        navigate("/login")
    }

    return (
        <div className='home-container'>
            <div className="logout">
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <h1>All Sales</h1>
            <div className="container">
                <div className="date-picker-container">
                    <div className="date-picker">
                        <span>Start Date: </span>
                        <DatePicker dateFormat="dd/MM/yyyy" className="date" selected={startDate} onChange={date => setStartDate(date)} />
                    </div>
                    <div className="date-picker">
                        <span>End Date: </span>
                        <DatePicker dateFormat="dd/MM/yyyy" className="date" selected={endDate} onChange={date => setEndDate(date)} />
                    </div>
                </div>

                <button onClick={handleSearchClick} className='sale-search'>Search</button>

                <div className="table-container">

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
                </div>
                <div className='table-buttons'>
                    <button disabled={pageIndex === 0} onClick={() => gotoPage(0)}>First</button>
                    <button disabled={!canPreviousPage} onClick={previousPage}>Prev</button>
                    <span>
                        {pageIndex + 1} of {pageCount}
                    </span>
                    <button disabled={!canNextPage} onClick={nextPage}>Next</button>
                    <button disabled={pageIndex === pageCount - 1} onClick={() => gotoPage(pageCount - 1)}>Last</button>
                </div>
            </div>

            {/* <h1>Delete Sales</h1>
            <div className="deleteSales">
                <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Enter Invoice Number"
                />
                <span onClick={handleDeleteSales}><FaTrash /></span>
            </div> */}
        </div>
    );
};

export default Home;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/allsales.scss';
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from "react-table";
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';

const AllSubusers = () => {
    const [data, setData] = useState([]);
    const [salesKey, setSalesKey] = useState(0);
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const Server = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [navigate, token]);

    useEffect(() => {
        console.log(token)
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${Server}/api/v1/sub-user/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setData(response.data.subUsers);
            } catch (error) {
                console.log(error);
                toast.error("Error fetching Sub-users");
            }
        };
        fetchData();
    }, [salesKey]);


    const handleDeleteSales = async (subuserId) => {

        if (!subuserId) {
            toast.warning("Cannot delete this sale");
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete this sale?");
        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(
                `${Server}/api/v1/sub-user/${subuserId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Sales deleted successfully");
            setSalesKey(prevKey => prevKey + 1);
        } catch (error) {
            toast.error('Error deleting sales');
        }
    };

    const handleEdit = (subUserID) => {
        navigate(`/subuser/${subUserID}`)
    }

    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name"
            },
            {
                Header: "Email",
                accessor: "email"
            },
            {
                Header: "Phone Number",
                accessor: "phoneNumber"
            },
            {
                Header: "Role",
                accessor: "role"
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <div div className='action-btns'>
                        <button onClick={() => handleEdit(row.original._id)} className='action-delete'>
                            <FaPencilAlt />
                        </button>
                        <button onClick={() => handleDeleteSales(row.original._id)} className='action-delete'>
                            <FaTrash />
                        </button>
                    </div>
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
            <h1>All Sub-users</h1>
            <button onClick={() => (navigate('/subuser/new'))} className='newSubUser-btn'>
                New sub-user
            </button>
            <div className="container">

                <div className="table-container">

                    {data && data.length === 0 ? (
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
        </div>
    );
};

export default AllSubusers;

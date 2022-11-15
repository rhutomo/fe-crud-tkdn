import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";

import Modal from "./Components/Modal";
import { Button } from "react-bootstrap";

const baseURL = process.env.REACT_APP_API_URL_BASE_API;

function App() {
  const [openModal, setOpenModal] = useState(false);
  const tableCol = [
    "name",
    "email",
    "password",
    "gender",
    "is_married",
    "address",
    "action"
  ];
  const [detailCust, setDetailCust] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [onCreate, setOnCreate] = useState(false);

  useEffect(() => {
    const getList = async () => {
      try {
        const { data } = await axios({
          url: `${baseURL}/customer`,
          method: "GET",
        });
        if (data.status.code == 200) {
          console.log("get customers status 200")
          console.log(data.result.data)
        }
        setCustomers(data.result.data);
      } catch (error) {
        console.log("error during get /customers");
      }
    };
    getList();
  }, [refetch]);

  const setModalData = (data) => {
    setDetailCust(data);
    setOpenModal(true);
  };

  const saveChanges = async (type, id) => {
    console.log(detailCust);
    switch (type) {
      case "create": 
        await axios({
          url: `${baseURL}/customer`,
          method: "POST",
          data: detailCust,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setRefetch(!refetch);
        setOpenModal(false);
        setOnCreate(false);
        return;
      case "edit":
        await axios({
          url: `${baseURL}/customer/${id}`,
          method: "PUT",
          data: detailCust,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setRefetch(!refetch);
        setOpenModal(false);
        setOnCreate(false);
        return;
      case "delete":
        await axios({
          url: `${baseURL}/customer/${id}`,
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setRefetch(!refetch);
        setOpenModal(false);
        setOnCreate(false);
        return;
    }
  };

  function onCreateClicked() {
    setOpenModal(true);
    setOnCreate(true);
  }

  return (
    <>
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={detailCust}
        setData={setDetailCust}
        saveChanges={saveChanges}
        onCreate={onCreate}
      />
      <br />
      <Button onClick={() => onCreateClicked()}>Add Customer</Button>
      <br />
      <div>click on each row for remove or edit customer</div>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            {tableCol.map((el, i) => (
              <th key={i.toString()}>{el}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((el) => (
            <tr
              key={el.id.toString()}
              onClick={() => setModalData(el)}
              role="button"
            >
              {tableCol.map((elem, i) => (
                <td key={i.toString()}>
                  {elem !== "is_married" ? el[elem] : el[elem] ? "Yes" : "No"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default App;

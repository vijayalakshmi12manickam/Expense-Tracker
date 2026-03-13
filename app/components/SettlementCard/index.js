import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CloseIcon from "../icons/close.svg";
import SettlementDrawer from "../SettlementDrawer";
import Avatar from "../avatar";

const SettlementCard = ({ name, close }) => {
  const [data, setData] = useState({});
  const [drawer, setDrawer] = useState(false);

  const loadTransactions = () => {
    fetch(`/api/expense/shared/person?name=${name}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadTransactions();
  }, [name]);

  return (
    <div>
      <div className="flex justify-between p-1 m-2 mb-2">
        <div className="flex gap-2 items-center">
          <Avatar name={name} />
          <h2 className="font-semibold">{`${name}'s Transactions `}</h2>
        </div>
        <div className="flex gap-2">
          {/* <button
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => setDrawer(true)}
          >
            Settle
          </button> */}
          <Image
            className="cursor-pointer"
            src={CloseIcon}
            alt="close icon"
            width={"20"}
            onClick={close}
          />
        </div>
      </div>
      {data && data.transactions && data.transactions.length
        ? data.transactions.map((el, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b-2 p-1 m-2 last:border-b-0 "
            >
              <div>
                <p className="text-base capitalize">{el.item}</p>
                <p className="text-xs text-gray-600">
                  {moment(el.date).format("DD-MM-YYYY")}
                </p>
              </div>
              <p className="font-semibold">{el.amount}</p>
            </div>
          ))
        : "No Transcation"}
      {/* {drawer ? (
        <SettlementDrawer
          open={drawer}
          person={name}
          onClose={() => setDrawer(false)}
          onSuccess={() => {
            setDrawer(false);
            loadTransactions(); // refresh
          }}
        />
      ) : (
        ""
      )} */}
    </div>
  );
};

export default SettlementCard;

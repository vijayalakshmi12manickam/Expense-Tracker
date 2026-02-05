"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Form from "./components/form";
import StarIcon from "./components/icons/star.svg";
import OthersIcon from "./components/icons/Others.png";
import ClothingIcon from "./components/icons/Clothing.png";
import EntertainmentIcon from "./components/icons/Entertainment.png";
import TravelIcon from "./components/icons/Travel.png";
import UtilitiesIcon from "./components/icons/Utilities.png";
import GroceriesIcon from "./components/icons/Groceries.png";
import FoodIcon from "./components/icons/Food.png";
import SummryTable from "./components/table/SummryTable";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
// import ExpensesTable from "./components/table/ExpenseTable";
import Link from "next/link";
import LineChart from "./components/lineChart";
import moment from "moment";

export default function Home() {
  // const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [popup, setPopup] = useState(false);
  const [expId, setExpId] = useState({});
  const [insights, setInsight] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartLabel, setChartLabel] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  // const getExpenses = () => {
  //   fetch("/api/expense")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("data", data);
  //       setExpenses(data);
  //     })
  //     .catch((err) => {
  //       console.error("❌ Error fetching expenses:", err);
  //     });
  // };

  const summaryApi = () => {
    fetch("/api/summary")
      .then((res) => res.json())
      .then((data) => {
        console.log("summary", data);
        setSummary(data);
        let res = data.insights.map(({ current }) => current);
        console.log(res);
        let label = data.insights.map(({ category }) => category);
        setChartData(res);
        setChartLabel(label);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getRecentExpense = () => {
    fetch("api/expense/recent")
      .then((res) => res.json())
      .then((data) => setRecentExpenses(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // getExpenses();
    summaryApi();
    getRecentExpense();
  }, []);

  const addClick = () => {
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
    // getExpenses();
    summaryApi();
    setExpId({});
  };

  const onClickInsight = () => {
    setInsight((ps) => !ps);
  };

  const categoryIcon = (category) => {
    switch (category) {
      case "Food":
        return FoodIcon;

      case "Utilities":
        return UtilitiesIcon;

      case "Entertainment":
        return EntertainmentIcon;

      case "Travel":
        return TravelIcon;

      case "Groceries":
        return GroceriesIcon;

      case "Clothing":
        return ClothingIcon;

      default:
        return OthersIcon;
    }
  };

  const data = {
    labels: chartLabel,
    datasets: [
      {
        label: "Current Month Categories",
        data: chartData,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(218, 112, 214)",
          "rgb(0, 153, 51)",
          "rgb(0, 128, 128)",
          "rgb(179, 89, 25)",
        ],
        // borderColor: "white",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "43%", // makes it more like a ring
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "center",
        labels: {
          color: "#374151",
          boxWidth: 16,
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            const dataset = data.datasets[0];
            // const total = dataset.data.reduce((a, b) => a + b, 0);

            return data.labels.map((label, i) => {
              const value = dataset.data[i];
              const color = dataset.backgroundColor[i];
              // const percent = ((value / total) * 100).toFixed(1);

              return {
                text: `${label}: (${value})`,
                fillStyle: color,
                fontColor: "#374151",
              };
            });
          },
        },
      },
      title: {
        display: false,
        text: "Monthly expenses",
        font: { size: 16 },
        color: "#1f2937", // gray-800
      },
    },
  };
  const shadowPlugin = {
    id: "shadow",
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
    },
    afterDraw: (chart) => {
      chart.ctx.restore();
    },
  };
  ChartJS.register(ArcElement, Tooltip, Legend, Title, shadowPlugin);

  return (
    <div className="w-full max-w-[1300px] mt-5 mx-auto">
      <div className="flex justify-end">
        <button
          style={{ backgroundColor: "#1e4846" }}
          className="px-8 font-semibold text-[#fefcfd] rounded-md cursor-pointer"
          onClick={() => addClick()}
        >
          Add Expense
        </button>
        {popup ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
              <div className="sm:flex sm:items-start">
                <Form
                  close={() => closePopup()}
                  expData={expId}
                  setExpId={setExpId}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="mt-3 p-4 mb-2">
        <LineChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="">
          {summary ? (
            <div className="shadow-md rounded-xl mt-1 p-4">
              <h2 className="text-xl text-center font-semibold text-gray-800 mb-2">
                Current Vs Previous
              </h2>
              <SummryTable summary={summary} insights={insights} />
              <div className="flex justify-end">
                <button
                  className="bg-[#1e4846] px-8 font-semibold text-[#fefcfd] rounded-md cursor-pointer mt-4 py-1 flex"
                  onClick={() => onClickInsight()}
                >
                  {insights ? (
                    "Hide Insights"
                  ) : (
                    <>
                      <Image
                        src={StarIcon}
                        alt="staricon"
                        width="20"
                        className="mr-1"
                      />
                      Insights
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="shadow-md rounded-xl mt-1 p-4 overflow-x-auto">
          <h2 className="text-xl text-center font-semibold text-gray-800 mb-2">
            Recent Expenses
          </h2>
          {/* <ExpensesTable display={true} expenses={recentExpenses} /> */}
          {recentExpenses &&
            recentExpenses.map((exp) => (
              <div className="flex border-b-black bg-white p-3 rounded-xl items-center mb-2 ">
                <div className="mr-3">
                  <Image
                    src={categoryIcon(exp.category)}
                    alt="icon"
                    width="40"
                  />
                </div>
                <div className="mr-3">
                  <h2 className="text-base font-semibold ">{exp.item}</h2>
                  {/* <p className="text-xs text-gray-500">4-02-2026</p> */}
                </div>
                <div className="text-base font-semibold ">
                  {" "}
                  - £{exp.amount.toFixed(2)}
                </div>
                <div className="ml-10 flex-col shadow-md ml-auto mr-3">
                  <div className="bg-red-500 text-xs font-bold text-white px-2">
                    {moment(exp.date).format("MMM")}
                  </div>
                  <div className="text-center">
                    {moment(exp.date).format("DD")}
                  </div>
                </div>
              </div>
            ))}
          <div className="flex justify-end mt-1">
            <Link className="text-[#1e4846] font-semibold" href="/expenses">
              ...more
            </Link>
          </div>
        </div>
      </div>

      <div className="w-[450px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

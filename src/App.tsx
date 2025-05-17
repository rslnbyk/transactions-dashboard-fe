import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Transaction {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
}

interface NewsItem {
  title: string;
  link: string;
}

const urlPrefix = "http://localhost:8090";

function App() {
  const [rates, setRates] = useState<{ USD: number; EUR: number }>();
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [news, setNews] = useState<NewsItem[]>();

  useEffect(() => {
    axios.get(`${urlPrefix}/api/transactions/exchange-rates`).then((res) => {
      setRates(res.data);
    });
    axios
      .get(`${urlPrefix}/api/transactions`)
      .then((res) => setTransactions(res.data));
    axios
      .get(`${urlPrefix}/api/transactions/news`)
      .then((res) => setNews(res.data));
  }, []);

  const downloadReport = () => {
    axios({
      url: `${urlPrefix}/api/transactions/export?month=2025-05`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div className="container">
      {rates && (
        <div className="exchange">
          <h2>Exchange Rates</h2>
          <p>USD: {rates.USD}</p>
          <p>EUR: {rates.EUR}</p>
        </div>
      )}

      <div className="main">
        {transactions && (
          <div className="transactions">
            <div className="transactions-header">
              <h3>All transactions</h3>
              <button onClick={downloadReport}>Get report</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{t.category}</td>
                    <td>{t.amount}</td>
                    <td>{t.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {news && (
          <div className="news">
            <h3>Financial News</h3>
            {news.map((item, idx) => (
              <div key={idx} className="news-item">
                <p>{item.title}</p>
                <a href={item.link} target="_blank" rel="noreferrer">
                  Read more
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

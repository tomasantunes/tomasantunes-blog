import React, {useEffect, useState} from 'react';
import axios from 'axios';
import config from '../config';

export default function Dashboard() {
  const [totalViews, setTotalViews] = useState(0);
  const [pageViews, setPageViews] = useState([]);

  function loadStats() {
    axios.get(config.BASE_URL + '/api/get-stats')
      .then(res => {
        console.log(res.data);
        setTotalViews(res.data.data.total_views);
        setPageViews(res.data.data.page_views);
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="p-5" style={{marginLeft: "280px", width: "calc(100% - 280px"}}>
      <h2>Dashboard</h2>
      <p><b>Total views: </b>{totalViews}</p>
      <p><b>Page views: </b></p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Page</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {pageViews.map((page) => (
            <tr>
              <td>{page.page_url}</td>
              <td>{page.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

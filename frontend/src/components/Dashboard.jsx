import React, {useEffect, useState} from 'react';
import axios from 'axios';
import config from '../config';

export default function Dashboard() {
  const [totalViews, setTotalViews] = useState(0);
  const [pageViews, setPageViews] = useState([]);
  const [users, setUsers] = useState([]);
  const [referrers, setReferrers] = useState([]);

  function loadStats() {
    axios.get(config.BASE_URL + '/api/get-stats')
      .then(res => {
        console.log(res.data);
        setTotalViews(res.data.data.total_views);
        setPageViews(res.data.data.page_views);
        setUsers(res.data.data.users);
        setReferrers(res.data.data.referrers);
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
      <p><b>Users: </b></p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>IP</th>
            <th>Country</th>
            <th>Operating System</th>
            <th>Browser</th>
            <th>Browser Version</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr>
              <td>{user.ip_address}</td>
              <td>{user.country}</td>
              <td>{user.operating_system}</td>
              <td>{user.browser}</td>
              <td>{user.browser_version}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><b>Referrers: </b></p>
      <ul>
        {referrers.map((r) => (
          <li>{r.referrer}</li>
        ))}
      </ul>
    </div>
  )
}

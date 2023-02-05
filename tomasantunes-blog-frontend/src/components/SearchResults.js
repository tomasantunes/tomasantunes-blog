import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import config from '../config.json';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";
import Footer from './Footer';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export default function SearchResults() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const params = useParams();

	function loadResults(query) {
		axios.get(config.BASE_URL + '/api/search/' + query)
		.then((response) => {
			if (response.data.status == "OK") {
				setResults(response.data.data);
			}
			else {
				MySwal.fire(response.data.error);
			}
		})
		.catch((err) => {
			MySwal.fire(err.message);
		});
	}

	useEffect(() => {
		setQuery(params.query);
		loadResults(params.query);
	}, []);

  return (
    <>
			<Helmet>
          <title>Search Results</title>
          <meta name="keywords" content="tomás antunes, blog, search, results, query, pages"/>
      </Helmet>
			<Navbar />
			<div className="container">
				<h2>Search Results for "{query}"</h2>
				<table class="table">
					<thead>
						<tr>
							<th>Page</th>
							<th>Link</th>
						</tr>
					</thead>
					<tbody>
						{results.map((result) => (
							<tr>
								<td>{result.title}</td>
								<td><Link to={"/blog-post/" + result.slug}>{config.BASE_URL}/blog-post/{result.slug}</Link></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Footer />
    </>
  )
}

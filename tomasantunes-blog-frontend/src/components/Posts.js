import React, {useState} from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);

  function loadPosts() {
    axios.get(config.BASE_URL + '/api/get-posts')
    .then((response) => {
      if (response.data.status == "OK") {
        setPosts(response.data.data);
      }
      else {
        alert(response.data.error);
      }
    })
    .catch((err) => {
      alert(err.message);
    });
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="container-fluid">
        <div className="row">
            <h1>Posts</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                      <tr>
                        <td>{post.title}</td>
                        <td>
                          <button className="btn btn-success">Edit</button>
                          <button className="btn btn-danger">Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      DataisLoaded: false,
      searchQuery: "",
      error: null,
      rateLimitExceeded: false,
      isLoading: false,
    };
  }

  handleSearch = (event) => {
    this.setState({ searchQuery: event.target.value, rateLimitExceeded: false }, () => {
      console.log("Search Query:", this.state.searchQuery);
    });
  };

  handleButtonClick = () => {
    this.setState({ isLoading: true }, () => {
      this.fetchUserDetails(this.state.searchQuery.trim().replace(/\s+/g, ''));
    });
  };

  fetchUserDetails = (username) => {
    if (username === "") {
      this.setState({
        items: [],
        DataisLoaded: false,
        error: null,
        isLoading: false,
      });
      return;
    }

    const apiUrl = `https://api.github.com/users/${username}`;
    console.log("Fetching details for:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("API rate limit exceeded");
          }
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((json) => {
        console.log("API Response:", json);
        this.setState({
          items: [json],
          DataisLoaded: true,
          error: null,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({
          items: [],
          DataisLoaded: true,
          error: error.message,
          rateLimitExceeded: error.message === "API rate limit exceeded",
          isLoading: false,
        });
      });
  };

  render() {
    const { DataisLoaded, items, searchQuery, error, rateLimitExceeded, isLoading } = this.state;

    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-black p-4 fixed top-0 w-full">
          <button className="search text-white">USER SEARCH APP</button>
          <div className="flex items-center">
            <input
              className="items-end border rounded p-2 transition duration-300 ease-in-out focus:border-blue-500 mr-2"
              type="text"
              name="UserName"
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Search by username"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center"
              onClick={this.handleButtonClick}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.7z"
                  />
                </svg>
              )}
              Search
            </button>
          </div>
        </nav>

        <div className="flex justify-center items-center min-h-screen bg-gray-100"> {/* This makes sure the content is centered vertically and horizontally */}
          <div className="container mx-auto p-4">
            {error && <div className="text-red-500 text-center">{error}</div>}
            {rateLimitExceeded && (
              <div className="text-red-500 text-center">
                API rate limit exceeded. Please try again later or authenticate to get a higher rate limit.
                <br />
                <a
                  href="https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 transition duration-300"
                >
                  Learn more
                </a>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              {DataisLoaded && items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white transition transform duration-200 hover:scale-105 text-center"
                  >
                    <img
                      src={item.avatar_url}
                      alt={item.login}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <div className="font-bold text-xl mb-2">{item.login}</div>
                    <a
                      href={item.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 transition duration-300"
                    >
                      View Profile
                    </a>
                    <p className="text-gray-700 text-base mt-2">
                      <strong>Repos:</strong> {item.public_repos}
                    </p>
                    <p className="text-gray-700 text-base">
                      <strong>Followers:</strong> {item.followers}
                    </p>
                    <p className="text-gray-700 text-base">
                      <strong>Following:</strong> {item.following}
                    </p>
                  </div>
                ))
              ) : (
                !rateLimitExceeded && (
                  <div className="text-center text-2xl animate-fadeIn">No users found</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

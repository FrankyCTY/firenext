const UsernameMessage = ({ username, isValid = false, isLoading = false }) => {
  if (isLoading) return <p>Checking...</p>;

  if (isValid) return <p className="text-success">{username} is available!</p>;

  if (username && username.length < 3) {
    return (
      <p className="text-danger">
        Please provide a username with 3 or more characters
      </p>
    );
  }

  if (username && !isValid)
    return <p className="text-danger">That username is taken!</p>;

  return <p></p>;
};

export default UsernameMessage;

function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      className="search-input"
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
}

export default SearchBar;

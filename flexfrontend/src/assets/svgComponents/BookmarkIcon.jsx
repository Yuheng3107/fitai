function BookmarkIcon(props) {
  return (
    <svg
      className={`${props.className} scale-x-110`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-32 0 580 580"
      height="48"
    >
      <path
        d="M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </svg>
  );
}

export default BookmarkIcon;

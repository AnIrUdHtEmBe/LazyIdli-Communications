const TennisIcon = () => {
    return(
        <div className="w-8 h-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-full h-full text-gray-700"
        >
          {/* Simple tennis ball */}
          <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1" fill="none" />
          <path d="M6 6 C10 10, 14 14, 18 18" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M6 18 C10 14, 14 10, 18 6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>
    )
}

export default TennisIcon;
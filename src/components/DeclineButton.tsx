interface deleteProps {
    onClick?:  () => void;
}

const DeclineButton = ({ onClick }: deleteProps) => {
    return(
        <div className="">  
        <div className="flex justify-center hover:bg-gray-100 items-center font-medium text-sm px-3 py-1 rounded-sm bg-gray-200 text-black w-fit">
            <button onClick={onClick}>
                Delete
            </button>
        </div>
        </div>
    )
}

export default DeclineButton;
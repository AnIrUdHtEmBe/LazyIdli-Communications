interface acceptProps {
    onClick?:  () => void;
}

const AcceptButton = ({ onClick }: acceptProps) => {
    return(
        <div className="">  
        <div className="flex justify-center hover:bg-gray-900 items-center font-medium text-sm px-3 py-1 rounded-sm bg-black text-white w-fit">
            <button onClick={onClick}>
                Accept
            </button>
        </div>
        </div>
    )
}

export default AcceptButton;
const BookReadTime = ({ readTime }) => {
    // Calculate total read time in minutes
    const totalMinutes = readTime.reduce((acc, cur) => acc + cur, 0);
  
    // Convert to hours and minutes if necessary
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes;
  
    // Format the output
    const formattedTime =
      hours > 0
        ? `${hours} hour${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} min` : ""} read`
        : `${minutes} min read`;
    console.log('minutes: ', minutes)
    console.log('readTime: ', readTime)
  
    return <span>{formattedTime}</span>;
  };

export default BookReadTime;
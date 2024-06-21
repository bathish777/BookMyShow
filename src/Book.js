import React, { useState, useEffect } from 'react';
import './Book.css';
import { useParams, Link } from "react-router-dom";

function Book({ movieName }) {
  const { id } = useParams();



  const [numSeats, setNumSeats] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Platinum');
  const [selectedPlatinumSeats, setSelectedPlatinumSeats] = useState([]);
  const [selectedGoldSeats, setSelectedGoldSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(JSON.parse(localStorage.getItem(`bookedSeats_${id}`)) || []);



  const [blockedSeats, setBlockedSeats] = useState([]);
  useEffect(() => {
    fetch('/blockedSeats.json')
      .then(response => response.json())
      .then(data => {
        setBlockedSeats(data.blockedSeats);
      })
      .catch(error => {
        console.error('Error fetching blocked seats:', error);
      });
  }, []);


  // After the existing useEffect hooks
useEffect(() => {
  setSelectedPlatinumSeats([]);
  setSelectedGoldSeats([]);
}, [numSeats]);




  const [checkboxes, setCheckboxes] = useState({
    available: true,
    selected: true,
    booked: true
  });

  // Local storage set
  useEffect(() => {
    localStorage.setItem(`bookedSeats_${id}`, JSON.stringify(bookedSeats));
  }, [bookedSeats, id]);

  // Update number of seats
  const handleNumSeatsChange = (e) => {
    setNumSeats(parseInt(e.target.value));  
    console.log("1");
  };

  // Update category
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedPlatinumSeats([]); // Clear selected platinum seats
    setSelectedGoldSeats([]); // Clear selected gold seats
  };   


  const isSpecialSeat = (seat) => {
    return blockedSeats.includes(seat);
  };
  



  // const handleSeatClick = (seat) => {
  //   // Determine which category the seat belongs to and get the selected seats array and its setter
  //   const selectedSeats = selectedCategory === 'Platinum' ? selectedPlatinumSeats : selectedGoldSeats;
  //   const setSelectedSeats = selectedCategory === 'Platinum' ? setSelectedPlatinumSeats : setSelectedGoldSeats;
  
  //   // If the seat is already selected, deselect it
  //   if (selectedSeats.includes(seat)) {
  //     setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat !== seat));
  //     return;
  //   }
  
  //   // Check if the seat is already booked
  //   if (bookedSeats.includes(seat)) {
  //     // If the seat is booked, do not select it
  //     return;
  //   }
  
  //   // Check if the seat is a special seat
  //   if (isSpecialSeat(seat)) {
  //     // If the seat is a special seat and not already selected, toggle its selection
  //     if (selectedSeats.length < numSeats) {
  //       setSelectedSeats([...selectedSeats, seat]);
  //     }
  //   } else {
  //     // For non-special seats, follow the existing logic
  //     const index = selectedSeats.indexOf(seat);
  //     if (index !== -1) {
  //       setSelectedSeats([...selectedSeats.slice(0, index), ...selectedSeats.slice(index + 1)]);
  //       return;
  //     }
  
  //     if (numSeats <= 2) {
  //       setSelectedSeats([seat]);
  //       return;
  //     }
  
  //     const newSeats = [...selectedSeats];
  //     let numSeatsToAdd = numSeats - selectedSeats.length;
  //     let nextSeat = seat;
  
  //     while (numSeatsToAdd > 0) {
  //       // Check if the next seat is already booked or selected
  //       if (bookedSeats.includes(nextSeat) || selectedSeats.includes(nextSeat)) {
  //         break;
  //       }
  
  //       if (!blockedSeats.includes(nextSeat)) {
  //         newSeats.push(nextSeat);
  //         numSeatsToAdd--;
  //       }
  //       if (isSpecialSeat(nextSeat)) {
  //         if (newSeats.length < numSeats) {
  //           newSeats.push(nextSeat);
  //           numSeatsToAdd--;
  //         }
  //         break;
  //       }
  //       nextSeat++;
  //     }
  //     setSelectedSeats(newSeats);
  //   }
  // };
  
  const handleSeatClick = (seat) => {
    // Determine which category the seat belongs to and get the selected seats array and its setter
    const selectedSeats = selectedCategory === 'Platinum' ? selectedPlatinumSeats : selectedGoldSeats;
    const setSelectedSeats = selectedCategory === 'Platinum' ? setSelectedPlatinumSeats : setSelectedGoldSeats;
  
    // If the seat is already selected, deselect it
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat !== seat));
      return;
    }
  
    // Check if the seat is from the non-selected category
    if ((selectedCategory === 'Platinum' && seat >= 31) || (selectedCategory === 'Gold' && seat <= 30)) {
      return; // Prevent selecting seats from the non-selected category
    }

    // Check if the seat is already booked
    if (bookedSeats.includes(seat)) {
      // If the seat is booked, do not select it
      return;
    }
  
    // Check if the seat is a special seat
    if (isSpecialSeat(seat)) {
      // If the seat is a special seat and not already selected, toggle its selection
      if (selectedSeats.length < numSeats) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    } else {
      // For non-special seats, follow the existing logic
      const index = selectedSeats.indexOf(seat);
      if (index !== -1) {
        setSelectedSeats([...selectedSeats.slice(0, index), ...selectedSeats.slice(index + 1)]);
        return;
      }
  
      if (numSeats <= 2) {
        setSelectedSeats([seat]);
        return;
      }
  
      const newSeats = [...selectedSeats];
      let numSeatsToAdd = numSeats - selectedSeats.length;
      let nextSeat = seat;
  
      while (numSeatsToAdd > 0) {
        // Check if the next seat is already booked or selected
        if (bookedSeats.includes(nextSeat) || selectedSeats.includes(nextSeat)) {
          break;
        }
  
        if (!blockedSeats.includes(nextSeat)) {
          newSeats.push(nextSeat);
          numSeatsToAdd--;
        }
        if (isSpecialSeat(nextSeat)) {
          if (newSeats.length < numSeats) {
            newSeats.push(nextSeat);
            numSeatsToAdd--;
          }
          break;
        }
        nextSeat++;
      }
      setSelectedSeats(newSeats);
    }
};

  

  const bookTickets = () => {
    let selectedSeats = selectedCategory === 'Platinum' ? selectedPlatinumSeats : selectedGoldSeats;
  
    // Exclude special indices from selected seats
    // selectedSeats = selectedSeats.filter(seat => !isSpecialSeat(seat));
  
    alert(`You have successfully booked ${selectedSeats.length} ${selectedCategory} tickets for seats: ${selectedSeats.join(', ')}`);
  
    const bookingDetails = {
      movieName: movieName,
      seats: selectedSeats
    };
  
    const bookings = JSON.parse(localStorage.getItem(`bookings_${id}`)) || [];
    localStorage.setItem(`bookings_${id}`, JSON.stringify([...bookings, bookingDetails]));
    setBookedSeats([...bookedSeats, ...selectedSeats]);
    setSelectedPlatinumSeats([]);
    setSelectedGoldSeats([]);
  };
  

 
  
  const handleCheckboxChange = (checkbox) => {
    setCheckboxes({ ...checkboxes, [checkbox]: !checkboxes[checkbox] });
  };

  // Generate options for number of seats
  const seatOptions = [1, 3, 3, 4,5,6,7,8,9].map(num => (
    <option key={num} value={num}>{num}</option>
  ));

  return (
    <div className="App">
      <h1>BookMyShow</h1>
      <h1 class="ab">Booking for {id}</h1>

      <div className="booking-form">
        <label htmlFor="numSeats">Number of Seats:</label>
        <select id="numSeats" value={numSeats} onChange={handleNumSeatsChange}>
          {seatOptions}
        </select>

        <label htmlFor="category">Select Category:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="Platinum">Platinum</option>
          <option value="Gold">Gold</option>
        </select>

        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={checkboxes.available}
              onChange={() => handleCheckboxChange('available')}
            />
            <span className="checkmark available"></span>
            Available
          </label>
          <label>
            <input
              type="checkbox"
              checked={checkboxes.selected}
              onChange={() => handleCheckboxChange('selected')}
            />
            <span className="checkmark selected"></span>
            Selected
          </label>
          <label>
            <input
              type="checkbox"
              checked={checkboxes.booked}
              onChange={() => handleCheckboxChange('booked')}
            />
            <span className="checkmark booked"></span>
            Booked
          </label>
        </div>

        <h2>Select Seats:</h2>
        <div className="seats">
          <div>
            <h3>Platinum Seats</h3>
            <div className="platinum-seats">
              {[...Array(30)].map((_, index) => (
                <div
                  key={index}
                  className={`seat platinum ${
                    checkboxes.booked && bookedSeats.includes(index + 1) ? 'booked' : ''
                  } ${
                    checkboxes.selected && selectedPlatinumSeats.includes(index + 1) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(index + 1)}
                >
                  {index + 1}
                </div> 
              ))}
            </div>
          </div>

          <div>
            <h3>Gold Seats</h3>
            <div className="gold-seats">
              {[...Array(40)].map((_, index) => (
                <div
                  key={index}
                  className={`seat gold ${
                    checkboxes.booked && bookedSeats.includes(index + 31) ? 'booked' : ''
                  } ${
                    checkboxes.selected &&
                    selectedCategory === 'Gold' &&
                    selectedGoldSeats.includes(index + 31)
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleSeatClick(index + 31)}
                >
                  {index + 31}
                </div>
              ))}
            </div>
          </div>
        </div>
       

<button 
  onClick={bookTickets} 
  disabled={
    // Disable if any non-selected category seats are selected

    (selectedCategory === 'Platinum' && selectedGoldSeats.length > 0) ||

    (selectedCategory === 'Gold' && selectedPlatinumSeats.length > 0) ||

    // Also disable if the number of selected seats does not match the selected number of seats
    (selectedPlatinumSeats.length + selectedGoldSeats.length !== numSeats)
  }
>
  Book Tickets
</button>

        <Link to="/">
          <button className="back-button">Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default Book;

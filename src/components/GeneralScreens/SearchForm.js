import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react'
import {BiSearchAlt2} from 'react-icons/bi'
import {  useNavigate } from "react-router-dom";
import instance from '../../Context/axiosConfig'
import { AuthContext } from '../../Context/AuthContext';


const SearchForm = () => {
    const { config } = useContext(AuthContext)
    const [searchTerm, setSearchTerm] = useState("");
    const navigate =useNavigate()
    const storageChangeEvent = useMemo(() => new Event('storageChange'), []);

    
    const handleSubmit = async (e) => {
        e.preventDefault() ; 
        if(searchTerm){
            navigate(`/?search=${searchTerm}`)
            localStorage.setItem('suggestions',JSON.stringify([]))
            window.dispatchEvent(storageChangeEvent);
        }
        setSearchTerm("")
    }


    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
      };


    const handleSearchSuggestions = useCallback(async () => {
        try {
          const response = await instance.get(`/search/searchSuggestion?q=${searchTerm}`, config);
          const data = response.data;
    
          if (response.status === 200) {
            localStorage.setItem('suggestions', JSON.stringify(data.body))
            window.dispatchEvent(storageChangeEvent);
          } else if(response.status === 201){
            localStorage.setItem('suggestions', JSON.stringify(data.body));
            window.dispatchEvent(storageChangeEvent);
        } else {
            console.error('Error fetching search suggestions:', data.error);
          }
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
        }
      }, [config, searchTerm, storageChangeEvent])
    
      useEffect(() => {
        if (searchTerm.trim() !== "") {
          handleSearchSuggestions();
        } else {
            localStorage.setItem('suggestions',JSON.stringify([]))
            window.dispatchEvent(storageChangeEvent);
        }
      }, [searchTerm, handleSearchSuggestions, storageChangeEvent]);

      const handleClearSearchTerm = () => {
        setSearchTerm("")
      }
      window.addEventListener('navigateEvent', handleClearSearchTerm);

  
    return (
     
        <form
            className= 'search-form'
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                name="search"
                placeholder="Search..."
                className=" m-4"
                onChange={handleSearchTermChange}
                value={searchTerm}
            />

            <button type="submit" className={searchTerm.trim() ? 'searchBtn' : 'disBtn'}  style={{background: 'transparent'}}><i> <BiSearchAlt2/> </i> </button>
            
        </form>
    )
}

export default SearchForm
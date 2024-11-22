import React from "react";
import styled from "styled-components";
import configData from "../../config.json";

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  height: 300px;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  margin-top: 10px;
  &:hover {
    margin-top: 0px;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px dashed black;
  background-color: transparent;
  margin-bottom: 8px;
  margin-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${configData.greenColor};
  transition: color 0.3s;
`;

const Typography = styled.div`
  text-align: center;
  color: ${configData.whiteColor};
`;

const SquareCard = (props) => {
  return (
    <StyledCard>
      <IconWrapper>{props.icon}</IconWrapper>
      <div>
        <Typography style={{ fontSize: "20px", fontWeight: "600" }}>
          {props.title}
        </Typography>
        <Typography>{props.content}</Typography>
      </div>
    </StyledCard>
  );
};

export default SquareCard;

import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Question from './Question'
import AddTrip from './AddTrip'
import { save, getValueFor } from './Utils';

const ip = process.env.IP_ADDRESS

function Trip() {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")

  save("question_id", "1")
  save("user_id", "1")

  useEffect(() => {
    fetch(`http://${ip}:8080/get/question/${getValueFor("question_id")}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Network response was not okay")
        }
        return res.json()
      })
      .then(data => {
        setFromLocation(`${data.fromTownName}, ${data.fromAreaName}, ${data.fromSectionName}`)
        if (data.toSectionName === "") {
          setToLocation(`${data.toTownName}, ${data.toAreaName}`)
        } else {
          setToLocation(`${data.toTownName}, ${data.toAreaName}, ${data.toSectionName}`)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Question question_id={getValueFor("question_id")} fromLocation={fromLocation} toLocation={toLocation} />
      <AddTrip user_id={getValueFor("user_id")} question_id={getValueFor("question_id")} fromLocation={fromLocation} />
    </View>
  )
}

export default Trip
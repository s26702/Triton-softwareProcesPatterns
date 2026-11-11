// Explicit sample data; replace through a service/repository when event storage exists.
export const volunteerDemoEvents = [
  {
    "id": "cph",
    "name": "CPH Marathon",
    "day": 16,
    "place": "Copenhagen",
    "desc": "Help make race day run smoothly. Join Triton to support runners before, during and after the race.",
    "shifts": [
      {
        "id": "water",
        "name": "Water station",
        "time": "07:00–11:00",
        "place": "Station 3 · Østerbro",
        "spots": 4,
        "task": "Set up the station, fill cups and hand water to runners. A team briefing takes place before your shift.",
        "meet": "06:45 at station 3",
        "need": "Wear practical clothing and shoes. A volunteer vest is provided."
      },
      {
        "id": "bags",
        "name": "Baggage drop-off",
        "time": "08:00–12:00",
        "place": "Fælledparken · entrance B",
        "spots": 2,
        "task": "Receive and label runners’ bags with the baggage team.",
        "meet": "07:45 at entrance B",
        "need": "Wear practical clothing and closed shoes."
      },
      {
        "id": "finish",
        "name": "Finish area",
        "time": "10:00–14:00",
        "place": "Fælledparken · finish area",
        "spots": 0,
        "task": "Support runners after the finish line.",
        "meet": "09:45 in the finish area",
        "need": "Wear practical clothing."
      }
    ]
  },
  {
    "id": "triton",
    "name": "Triton club meet",
    "day": 15,
    "place": "Ballerup",
    "desc": "Support the club swimming meet and help participants throughout the day.",
    "shifts": [
      {
        "id": "welcome",
        "name": "Participant welcome",
        "time": "09:00–12:00",
        "place": "Ballerup Svømmehal · main entrance",
        "spots": 3,
        "task": "Welcome participants and direct them to the changing rooms and pool.",
        "meet": "08:45 at the main entrance",
        "need": "Bring your club shirt and indoor shoes."
      }
    ]
  },
  {
    "id": "iron",
    "name": "IRONMAN",
    "day": 30,
    "place": "Copenhagen",
    "desc": "Join the course team and support participants on race day.",
    "shifts": [
      {
        "id": "depot",
        "name": "Course refreshments",
        "time": "12:00–16:00",
        "place": "Copenhagen · station 2",
        "spots": 8,
        "task": "Prepare refreshments and assist participants at the station.",
        "meet": "11:45 at station 2",
        "need": "Dress for the weather and wear practical shoes."
      }
    ]
  }
];

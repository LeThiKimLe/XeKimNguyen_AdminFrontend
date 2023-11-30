const listDeparture = []
const listDestination = []

export const createListRoutes = (routeData) => {
    routeData.forEach((route) => {
        addRoute(route, 'forward')
        addRoute(route, 'backward')
    })
    return {
        listDeparture: listDeparture,
        listDestination: listDestination,
    }
}

const addRoute = (route, round) => {
    const roundkey = round === 'forward' ? 1 : 0

    const cusRoute =
        roundkey === 1
            ? route
            : {
                  ...route,
                  departure: route.destination,
                  destination: route.departure,
              }

    const addKeyPair = () => {
        const key = listDeparture.length
        listDeparture.push({
            key: key,
            location: cusRoute.departure,
        })
        listDestination.push({
            key: key,
            location: [
                {
                    destination: cusRoute.destination,
                    routeId: cusRoute.id,
                    round: roundkey,
                },
            ],
        })
    }

    if (listDeparture.length !== 0) {
        const findKey = listDeparture.filter(
            (depart) => depart.location.id === cusRoute.departure.id,
        )[0]
        if (findKey) {
            const key = findKey.key
            const mapDesIndex = listDestination.indexOf(
                listDestination.filter((des) => des.key === key)[0],
            )
            {
                if (
                    !listDestination[mapDesIndex].location
                        .map((local) => local.destination.id)
                        .includes(cusRoute.destination.id)
                ) {
                    listDestination[mapDesIndex].location.push({
                        destination: cusRoute.destination,
                        routeId: cusRoute.id,
                        round: roundkey,
                    })
                }
            }
        } else {
            addKeyPair()
        }
    } else {
        addKeyPair()
    }
}

export const getDesandDep = (listRoute, depName, desName) => {
    const { listDeparture, listDestination } = createListRoutes(listRoute)
    const depOptions = listDeparture.map((dep) => {
        return { value: dep.key, label: dep.location.name }
    })
    const departure = depOptions.filter((option) => option.label === depName)[0]
    const desOptions = departure
        ? listDestination
              .filter((des) => des.key === departure.value)[0]
              .location.map((des) => {
                  return {
                      value: { id: des.routeId, turn: des.round },
                      label: des.destination.name,
                  }
              })
        : []
    const destination = desOptions.filter((option) => option.label === desName)[0]
    return { departure, destination }
}

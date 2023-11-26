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

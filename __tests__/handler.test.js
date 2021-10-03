const { getPlanets } = require('../lambdas/get')
const { sendData } = require('../lambdas/post')
const { getMyData } = require('../lambdas/get_my_data')

describe("Servicio Lambda obtener los datos swapi", () => {
    it("Response is a object", async () => {
        let response = await getPlanets({
            query: {
                service: "planets",
                number: "2"
            }
        }, {})
        expect(typeof response).toBe("object")
    })

    it("_200 works", async () => {
        let response = await getPlanets({
            query: {
                service: "planets",
                number: "1"
            }
        }, {})
        expect(response.status).toBe(200)
        expect(response.message).toBe('ok')
    })

    it("If write planets doeas exist always returned Tatooine", async () => {
        let response = await getPlanets({
            query: {
                service: "japon",
                number: "1"
            }
        }, {})
        expect(response.status).toBe(200)
        expect(response.data.nombre).toBe('Tatooine')
    })

    it("_404 works", async () => {
        let response = await getPlanets({
            query: {
                service: "planets",
                number: 0
            }
        }, {})

        expect(response.status).toBe(404)
        expect(response.message).toBe('error')
    })
})

describe("Servicio Lambda set datos", () => {
    it("Response is a object", async () => {
        let response = await sendData({
            query: {
                service: "planets",
                number: "2"
            }
        }, {})
        expect(typeof response).toBe("object")
    })
    it("_201 works", async () => {
        let response = await sendData({
            query: {
                service: "planets",
                number: "2"
            }
        }, {})
        expect(response.status).toBe(201)
    })
})

describe("Servicio de obtener mis datos", () => {
    it("Response is a object", async () => {
        let response = await getMyData({})
        expect(typeof response).toBe("object")
    })

    it("_200 works", async () => {
        let response = await getMyData({})
        expect(response.status).toBe(200)
        expect(response.message).toBe('ok')
    })
})
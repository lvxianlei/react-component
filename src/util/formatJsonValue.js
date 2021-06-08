import { getSessionItem } from './index'

const generateHeadItem = jsonName => ({
    "position": "0",
    "name": jsonName,
    "label": jsonName
})

const formatRules = {
    strValue: value => ({ value }),
    intValue: value => ({ value: parseInt(value) }),
    decimalValue: value => ({ value }),
    customValue: value => {
        const { id: userId } = getSessionItem("userInfo") && JSON.parse(getSessionItem("userInfo"))
        const values = ["currentDate", "currentData"]
        if (values.includes(value)) {
            return ({ value: new Date().getTime(), type: "date" })
        }
        if (value === "currentUserId") {
            return ({ value: userId })
        }
    },
    field: (value, data) => {
        if (data) {
            const dataFiledName = value.split(".")
            if (dataFiledName.length === 2) {
                return ({ value: data[dataFiledName[1]] })
            }
            if (dataFiledName.length === 1) {
                return ({ value: data[dataFiledName[0]] })
            }
        }
    },
    relateValue: value => ({ value, type: "object" }),
    relateField: (value, data) => {
        if (data) {
            const dataFiledName = value.split(".")
            if (dataFiledName.length === 2) {
                return ({ value: data[dataFiledName[1]], type: "object" })
            }
            if (dataFiledName.length === 1) {
                return ({ value: data[dataFiledName[0]], type: "object" })
            }
        }
    },
    serialValue: value => ({ value: null, type: "serial" }),
    shortSerialValue: value => ({ value: null, type: "shortPalLabelSerial" }),
}

export default function formatJsonValue (jsonValue, data) {
    if (!jsonValue || jsonValue === "null" || jsonValue === "undefined") return null
    const formatedValues = {}
    const headList = []
    const jsonValueObj = JSON.parse(jsonValue)
    Object.keys(jsonValueObj).forEach(item => {
        const [name, filed] = jsonValueObj[item].split("_")
        if (filed || filed === "") {
            const filedValue = formatRules[name](filed, data)
            formatedValues[item] = filedValue.value
            headList.push({ ...generateHeadItem(item), type: filedValue.type || "hidden" })
        } else {
            formatedValues[item] = name
            headList.push({ ...generateHeadItem(item), type: "hidden" })
        }
    })

    return ({ ...formatedValues, headList })
}
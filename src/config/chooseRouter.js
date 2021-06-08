const chooseRouter = column => {
    const { service, pageName, searchPath: search, keyField, record, name } = column
    let specService = service
    let specPageName = pageName
    let specItemId = record[keyField]
    if (name === "flowInstanceTitle") {
        const uriInfoArray = (record.viewUrl || record.baseUrl + "/" + record.modelId).replace(/^\/+|\/+$/g, '').split('/')
        specService = uriInfoArray[0]
        specPageName = uriInfoArray[4]
        specItemId = uriInfoArray[5]
    }
    
    const routes = [
        {
            service: "customer",
            names: ["salesOrder02", "purchaseOrder02", "letterOfAdvice02"],
            router: {
                pathname: `/detail/${specService}/${specPageName}/${specItemId}`,
                search
            }
        },
        {
            service: "customer",
            names: ["previewPriceSheetDetail", "changedPriceSheetDetail"],
            router: {
                pathname: `/changeOrder/${specService}/changedPriceTool/${specItemId}`,
                search
            }
        },
        {
            service: "customer",
            names: ["flowInstanceTitle"],
            router: {
                pathname: `/detail/${specService}/${specPageName}/${specItemId}`,
                search
            }
        }
    ]

    const route = routes.filter(route => route.service.includes(specService) && route.names.includes(specPageName))

    return route.length > 0 ? route[0].router : {
        pathname: `/detail/${specService}/${specPageName}/${specItemId}`,
        search
    }
}


export default chooseRouter
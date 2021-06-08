import { useState, useLayoutEffect, useCallback, memo } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { Layout, Menu, Skeleton, Spin, PageHeader, Dropdown, Avatar, Button } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { Overview, Detail, Edit, DetailSpec, PageConfig, User, OfferDetail, SearchConfig } from './index'
import { PageSetting, ChangeOrder, TreeTable } from './DetailSpec'
import { NoMatch } from '../common'
import { Scrollbars } from 'react-custom-scrollbars'
import { MAIN_MENU_URL, Default_Search, OSS_URL } from '../config/API'
import { chooseRouter, getSessionItem, setSessionItem, formatSearch } from '../util'
import { useRequest } from 'ahooks'
import { createSevices } from '../hooks'
import '../scss/Main.scss'
import Logo from '../public/images/logo.png'

const { Header, Sider } = Layout
const Main = memo(({ location: { search } }) => {
    const history = useHistory()
    const { data, loading, error } = useRequest(createSevices(MAIN_MENU_URL, {}))
    const [defaultKeys, setDefaultKeys] = useState('g01.p01.c01')
    const [menuSlide, setMenuSlide] = useState([])
    const [collapsed, setCollapsed] = useState(false)

    const positionOptions = useCallback((key, data = menuSlide) => {
        const keyPath = key.split('.')
        const selectSubItem = data.filter(item => item.id === `${keyPath[0]}.${keyPath[1]}`)[0].childJmenu
        return selectSubItem.filter(item => item.id === key)[0]
    }, [menuSlide])

    useLayoutEffect(() => {
        if (data && data.length > 0) {
            const { loc: pageId } = formatSearch(search || Default_Search)
            const slideData = data.filter(item => item.id === pageId.split('.')[0])
            setMenuSlide(slideData[0].childJmenu)
            setDefaultKeys(pageId)
            const selectItem = positionOptions(pageId, slideData[0].childJmenu)
            setSessionItem({ menu: JSON.stringify(selectItem) })
        }
    }, [data, search, setMenuSlide, setDefaultKeys, positionOptions])

    const headerMenuClick = useCallback(({ key }) => {
        if (key === "user-center") {
            return
        }
        const slideData = data.filter(item => item.id === key)
        const path = chooseRouter(slideData[0].childJmenu[0].childJmenu[0].url, slideData[0].childJmenu[0].childJmenu[0].pageName)
        if (slideData) {
            setSessionItem({ menu: JSON.stringify(slideData[0].childJmenu[0].childJmenu[0]) })
            setMenuSlide(slideData[0].childJmenu)
            setDefaultKeys(slideData[0].childJmenu[0].childJmenu[0].id)
            history.push({
                pathname: path,
                search: `?loc=${slideData[0].childJmenu[0].childJmenu[0].id}`,
                state: slideData[0].childJmenu[0].childJmenu[0]
            })
        }
    }, [data, setMenuSlide, setDefaultKeys, history])

    const leftSliderClick = useCallback(({ key }) => {
        const selectItem = positionOptions(key)
        const path = chooseRouter(selectItem.url, selectItem.pageName)
        if (selectItem.url.includes('http')) {
            const openUrlOption = selectItem.url.includes("?") ? "&" : "?"
            window.open(`${selectItem.url + openUrlOption}access_token=${getSessionItem('access_token')}`)
            return
        }
        setDefaultKeys(selectItem.id)
        setSessionItem({ menu: JSON.stringify(selectItem) })
        history.push({ pathname: path, search: `?loc=${selectItem.id}`, state: selectItem })
    }, [setDefaultKeys, positionOptions, history])

    const dropdownClick = useCallback(({ key }) => {
        if (key === "exit") {
            sessionStorage.clear()
            history.replace('/')
            return
        }
        const slideData = data.filter(item => item.id === data.slice(-1)[0].id)
        setMenuSlide(slideData[0].childJmenu)
        const selectItem = positionOptions(key, data.slice(-1)[0].childJmenu)
        const path = chooseRouter(selectItem.url, selectItem.pageName)
        setDefaultKeys(selectItem.id)
        setSessionItem({ menu: JSON.stringify(selectItem) })
        history.push({ pathname: path, search: `?loc=${selectItem.id}`, state: selectItem })
    }, [data, setMenuSlide, setDefaultKeys, history, positionOptions])

    if (error) { return <NoMatch status="500" /> }

    if (loading) { return <Spin loading={loading.toString()} /> }

    if (data.length === 0) {
        return <NoMatch
            status="warning"
            message="您的菜单为空，请联系管理员"
            extra={<Button
                type="primary"
                onClick={() => dropdownClick({ key: 'exit' })}>重新登录</Button>}
        />
    }

    const headMenuData = data.slice(0, data.length - 1)
    const userCenter = data[data.length - 1]
    const { headUrl, nickname } = getSessionItem("userInfo") && JSON.parse(getSessionItem("userInfo"))
    const userMenu = (<Menu onClick={dropdownClick}>
        {userCenter.childJmenu[0].childJmenu.map(item => <Menu.Item key={item.id}>{item.name}</Menu.Item>)}
        <Menu.Item key="exit">退出登录</Menu.Item>
    </Menu>)

    return (
        <Layout className="top">
            <div className="colorful">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <Skeleton loading={loading} active>
                <Header className="header">
                    <div className="logo">
                        <span className="collapsed" onClick={() => setCollapsed(!collapsed)}>{collapsed ?
                            <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
                        <img src={Logo} alt="logo" />
                    </div>
                    <Menu
                        className="menu"
                        mode="horizontal"
                        defaultSelectedKeys={[defaultKeys.split('.')[0]]}
                        selectedKeys={[defaultKeys.split('.')[0]]}
                        onClick={headerMenuClick}
                    >
                        {data && headMenuData.map(item => <Menu.Item key={item.id}>{item.name}</Menu.Item>)}
                        <Menu.Item key="user-center" className="user-center">
                            <Dropdown overlay={userMenu} overlayClassName="user-dropdown" ><span className="dropdown-span"><Avatar className="head-image" src={headUrl && (OSS_URL + headUrl)} icon={<UserOutlined />} />{nickname}</span></Dropdown>
                        </Menu.Item>
                    </Menu>
                </Header>
            </Skeleton>
            <Layout className="main">
                <Skeleton loading={loading} active>
                    <Sider className="left-sider" width={collapsed ? 0 : 180}>
                        <Scrollbars autoHeight autoHeightMin={'100vh'} autoHide>
                            <Menu
                                className="menu"
                                mode="inline"
                                defaultSelectedKeys={[defaultKeys]}
                                selectedKeys={[defaultKeys]}
                                onClick={leftSliderClick}
                            >
                                {menuSlide && menuSlide.map(itemGroup => <Menu.ItemGroup key={itemGroup.id}
                                    title={itemGroup.name}>
                                    {itemGroup.childJmenu && itemGroup.childJmenu.map(item => <Menu.Item key={item.id}>{item.name}</Menu.Item>)}
                                </Menu.ItemGroup>)}
                            </Menu>
                        </Scrollbars>
                    </Sider>
                </Skeleton>
                <Layout className="content-warp">
                    <div className="content">
                        <PageHeader
                            title={`${getSessionItem('menu') && JSON.parse(getSessionItem('menu')).name}`}
                            onBack={() => window.history.back()}
                        />
                        {getSessionItem('menu') && <Switch>
                            <Route exact path="/" component={Overview} />
                            <Route exact path="/overview/:pageName" component={Overview} />
                            <Route exact path="/treeTable/:pageName" component={TreeTable} />
                            <Route exact path="/plist/:service/:pageName/:overviewKey/:overviewId" component={Overview} />
                            <Route exact path="/plist/:service/:pageName" component={Overview} />
                            <Route exact path="/pageSetting/:pageName" component={PageSetting} />
                            <Route exact path="/goodsProductDetailList/:service/:buttonId" component={PageSetting} />
                            <Route exact path="/pageButtonSetting/:service/:buttonId" component={PageSetting} />
                            <Route exact path="/pageQuerySetting/:service/:buttonId" component={PageSetting} />
                            <Route exact path="/detail/:service/:pageName/:detailId" component={Detail} />
                            <Route exact path="/edit/:service/:formName/:editId" component={Edit} />
                            <Route exact path="/pageConfig/:service/:type/:name" component={PageConfig} />
                            <Route exact path="/detailspec/:pageName" component={DetailSpec} />
                            <Route exact path="/changeOrder/:service/:pageName/:priceSheetId" component={ChangeOrder} />
                            <Route exact path="/offerDetail/:service/:item/:showType/:offerId" component={OfferDetail} />

                            <Route exact path="/SearchConfig/:service/:configId" component={SearchConfig} />

                            <Route exact path="/user/:pageName" component={User} />
                            <Route exact path="/overview/nomatch/:status" component={NoMatch} />
                            <Route component={NoMatch} />
                        </Switch>}
                    </div>
                </Layout>
            </Layout>
        </Layout>
    )
})

export default Main
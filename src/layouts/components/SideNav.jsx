import { defineComponent, computed, h } from 'vue';
import { getActive } from '@/router';
import AssetLogo from '@/assets/icon.svg?component';

import '@/style/layout.less';

const getMenuList = (list, basePath) => {
  if (!list) {
    return [];
  }
  // 如果meta中有orderNo则按照从小到大排序
  list.sort((a, b) => {
    return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
  });
  return list
    .map((item) => {
      const path = basePath ? `${basePath}/${item.path}` : item.path;
      return {
        path,
        title: item.meta?.title,
        icon: item.meta?.icon || '',
        children: getMenuList(item.children, path),
        meta: item.meta,
        redirect: item.redirect,
      };
    })
    .filter((item) => item.meta && item.meta.hidden !== true);
};

const renderIcon = (item) => {
  if (typeof item.icon === 'string') {
    return () => item.icon && <t-icon name={item.icon}></t-icon>;
  }
  if (item.icon && typeof item.icon.render === 'function') {
    return () =>
      h(item.icon.render(), {
        class: 't-icon',
      });
  }
  return () => '';
};

const getPath = (active, item) => {
  if (active.startsWith(item.path)) {
    return active;
  }
  return item.meta?.single ? item.redirect : item.path;
};

const useRenderNav = (active, list) => {
  return list.map((item) => {
    if (!item.children || !item.children.length || item.meta?.single) {
      const href = item.path.match(/(http|https):\/\/([\w.]+\/?)\S*/);
      if (href) {
        return (
          <t-menu-item href={href?.[0]} name={item.path} value={getPath(active, item)} icon={renderIcon(item)}>
            {item.title}
          </t-menu-item>
        );
      }
      return (
        <t-menu-item name={item.path} value={getPath(active, item)} to={item.path} icon={renderIcon(item)}>
          {item.title}
        </t-menu-item>
      );
    }
    return (
      // <t-submenu name={item.path} value={item.path} title={item.title} icon={renderIcon(item)}>
      //   {item.children && useRenderNav(active, item.children)}
      // </t-submenu>
      <t-menu-item name={item.path} value={getPath(active, item)} to={item.path} icon={renderIcon(item)}>
        {item.title}
      </t-menu-item>
    );
  });
};

export default defineComponent({
  name: 'SideNav',
  components: {
    AssetLogo,
  },
  props: {
    navData: {
      type: Array,
      default: () => [],
    },
    theme: {
      type: String,
      default: 'auto',
    }
  },
  setup(props) {
    const active = computed(() =>getActive());
    const list = computed(() => {
      const { navData } = props;
      return getMenuList(navData);
    });
    return {
      active,
      list,
      useRenderNav,
    };
  },
  render() {
    return (
      <div class="tdesign-starter-sidebar-layout tdesign-starter-sidebar-compact">
        <t-menu
          theme={this.theme}
          value={this.active}
          collapsed
          class="tdesign-block-column"
        >
          <t-menu-item  disabled style="margin-top: 5px" v-slots={{
            icon: () => <asset-logo />,
          }}>Tool</t-menu-item>

          {this.useRenderNav(this.active, this.list)}
        </t-menu>
      </div>
    )
  },
});

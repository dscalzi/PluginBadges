# Plugin Badges

Download badges for plugins hosted on Spigot, DevBukkit, Ore, and GitHub.

Create badges using the following website. https://pluginbadges.glitch.me/

### How it Works

The download numbers will be pulled from each site specified and combined. The total value will be displayed on the badge.

### Format

`https://pluginbadges.glitch.me/api/v1/dl/<name>-<color>.svg`

Supports:
  * **DevBukkit** (`https://dev.bukkit.org/projects/<id>`)
    * `?bukkit=<id>`
  * **Spigot** (`https://www.spigotmc.org/resources/<id>`)
    * `?spigot=<id>`
  * **Ore (Sponge)** ([Plugin Id](https://docs.spongepowered.org/stable/en/ore/routes/project.html))
    * `?ore=<id>`
  * **GitHub** (`https://github.com/<user>/<repo>`)
    * `?github=<user>/<repo>`

You can connect multiple parameters with `&`. Supports most https://shields.io/ parameters. Please file an issue if any are missing.

#### Example

```
https://pluginbadges.glitch.me/api/v1/dl/SkyChanger-limegreen.svg?spigot=skychanger.37524&bukkit=skychanger&ore=skychanger&github=dscalzi/SkyChanger&style=for-the-badge
```

![Example Image](https://pluginbadges.glitch.me/api/v1/dl/SkyChanger-limegreen.svg?spigot=skychanger.37524&bukkit=skychanger&ore=skychanger&github=dscalzi/SkyChanger&style=for-the-badge)

### Supported Query Terms

* `?style=` `[plastic, flat, flat-square, for-the-badge, popout, popout-square, social]`
  * Demos can be viewed on https://shields.io/#styles

* `?labelColor=` The color of the left side of the badge.
* `?logo=` Insert custom logo image (≥ 14px high)
  * Accepts URLs to images as awell as base64 (ex. `?logo=data:image/png;base64,…`)
* `?logoWidth=` Set the horizontal space to give to the logo

---

#### Using PluginBadges? Add a  ⭐
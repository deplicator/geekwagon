---
title: I Love rsnapshot
date: 2016-02-20
tags: backup, linux, scripts
---

I love [rsnapshot][1]. I like to think if I wrote a backup program, it would be a lot like
rsnapshot. This post is about how I chose to use rsnapshot for my local backups.

<!-- more -->


I had to learn some new things to understand how it works, so please correct me where I'm
wrong. **In a nutshell**, it uses rsync to make a copy of a directory. When it makes a copy, it
moves the old copy to a new place, and links to the first copy with hard links. Then only the files
that changed are updated.

Maybe this overview of space used for each copy will help.

```
808G    /snapshot/hourly.0/
478M    /snapshot/hourly.1/
531M    /snapshot/hourly.2/
520M    /snapshot/hourly.3/
1.2G    /snapshot/hourly.4/
854M    /snapshot/hourly.5/
1.3G    /snapshot/daily.0/
3.2G    /snapshot/daily.1/
4.3G    /snapshot/daily.2/
1.3G    /snapshot/daily.3/
1.2G    /snapshot/daily.4/
1.3G    /snapshot/daily.5/
7.8G    /snapshot/daily.6/
26G     /snapshot/weekly.0/
1.8G    /snapshot/weekly.1/
1.1G    /snapshot/weekly.2/
1.2G    /snapshot/weekly.3/
46G     /snapshot/monthly.0/
8.9G    /snapshot/monthly.1/
5.0G    /snapshot/monthly.2/
7.4G    /snapshot/quarterly.0/
20G     /snapshot/quarterly.1/
4.2G    /snapshot/quarterly.2/
4.1G    /snapshot/quarterly.3/
39G     /snapshot/yearly.0/
993G    total
```

The first one, the 808G, is a copy of what I've got right now--no more than four hours old (because
it runs every four hours). The next one `hourly.1` is the same thing, but from more than four hours
ago. It uses hard links for every file that did not change. This saves a lot of space.

Soft links are easy to get, just think of a Windows shortcut. A tiny file that just points to the
real file. Hard links are different. For all intents and purposes, a hard link is the file. The file
in on the drive once, and it's being pointed to by the original file pointer (in `hourly.0` here)
and it's being pointed to by the hard link. Basically all files have one hard link to be accessed,
this just another "pointer" to the same file. The advantage (or sometimes disadvantage) is the OS
doesn't know (or doesn't care) which pointer is the real one. They're both real. There is a lot of
material on the net to better explain hard links. This [answer on stackexchange.com][2] was
enlightening to me.

### The Backup

I run Ubuntu Server 14.04, and rnapshot was really easy to get going. Despite [this tutorial being
for 12.04][3], it's pretty much all the same. I skipped past all the ssh stuff, I've only got the
one server (how big of a nerd do you think I am?). In my case I back up `/home`, `/etc`, `/usr`, and
`/var`; although I'm not sure why I bother with some of those. I simply copy them locally to
`/snapshot` (no idea why I didn't call it `/snapshots`).

In that tutorial it will show you how to get started. I made some minor changes because I have so
much space.

```
0 */4  * * *           root    /usr/bin/rsnapshot hourly
30   3  * * *          root    /usr/bin/rsnapshot daily
0   3  * * 1           root    /usr/bin/rsnapshot weekly
0   2  1 * *           root    /usr/bin/rsnapshot monthly
0   2 30 3,6,9,12 *    root    /usr/bin/rsnapshot quarterly
0   2 31 12 *          root    /usr/bin/rsnapshot yearly
0  10  *  * *          root    /home/james/scripts/rsnapshot-mirror.sh
0  14  *  * *          root    /home/james/scripts/rsnapshot-report.sh
```

I'll explain those last two jobs in the next two sections. This setup is fine for getting old
versions of files, but not much good for a backup.

### The Backup of the Backup

Here is a picture I made to show how it all works.

![overview][p1]

_Side note: MSPaint has cool new features, like adjust that square you just made._

So we want to mirror the `/snapshot` directory to an external drive. This might seem strait forward,
but remember those hard links? They become a problem here. If we strait copy the entire directory to
another drive, it will copy the same files many times.

Fortunately rync has an option to fix this.

`sudo rsync -a -H --delete --numeric-ids --progress /snapshot /mnt/external/`

I found this [from this guy][4]. Again, minus all the multiple server stuff (really I'm not that big
of a nerd). That guy explains:

> -a : Archive mode (i.e. recurs into directories, and preserve symlinks, file permissions, file
> modification times, file group, file owner, device files & special files)

> -H : Preserve hard links (i.e. copy hard links as hard links)

> --delete : Delete extraneous files from the receiving side i.e. keep exact replica of your
snapshot directory.

> --numeric-ids : Transfer numeric group and user IDs rather than using user and group names and
mapping them at both ends.

> --progress : Show progress during transfer.

I didn't use `-z` because I'm only copying over USB and I don't care how long it takes. I also may
not need `--numeric-ids`. For the script I don't need `--progress`, but it's nice when making sure
the command works as expected. The important one is `-H`.

I admit, it's not the best backup. It's got some holes, I'll address that last.

### See the Backup

I get kicks from running `sudo rsnapshot du` (it gives the output shown in the first code section
above). I like to see how much space I waste from snapshot to snapshot. Sometimes it's a surprise
and something to investigate. I ran it so much I finally just wrote a script to give me a cvs of the
data every day. Here is the contents of `rsnapshot-report.sh`.

```
#!/bin/bash
# must be run as administrator

ducmd="/usr/bin/rsnapshot du"
$ducmd > /home/james/tmp/rsnapshot-tmp-output.txt

foo=$(date +"%Y-%m-%d")
foo="$foo, "

while IFS='' read -r line || [[ -n "$line" ]]; do
    IFS=$':' DIRS=(${line//$'\t'/:})
    foo="$foo ${DIRS%'\t'*}, "
done < /home/james/tmp/rsnapshot-tmp-output.txt

foo=${foo::-2}
echo $foo >> /home/james/rsnapshot-du-results.csv
```

It returns only the space used in a single line separated by commas.

![The numbers][p2]

### The Future

The obvious problem is it's all in teh same place, connected to the same machine. There some
protection in that one drive is USB, but some kind of crazy power surge could leave me kicking
myself.

The plan is to build a second server (okay I am that big of a nerd) and put it somewhere else. Like
maybe my parents house. Then create a VPN between them. It sounds like a lot of trouble, and I'm not
100% sure which way I'll go about it. The VPN version of DD-WRT's seems promising. I'm also not sure
if mirroring the data then having each machine make snapshots, or have the machines mirror their
snapshots is the way to go. I'll figure it out when I get there. Then I'll probably write about it.


[1]: http://rsnapshot.org/
[2]: http://unix.stackexchange.com/a/50188/61039
[3]: https://www.digitalocean.com/community/tutorials/how-to-install-rsnapshot-on-ubuntu-12-04
[4]: http://www.cyberciti.biz/faq/linux-unix-apple-osx-bsd-rsync-copy-hard-links/
[p1]: images/2016-02-20_overview.png "Made with love in MSPaint."
[p2]: images/2016-02-20_spreadsheet.png "Up next, how to import a csv into gdrive automatically (not really)."

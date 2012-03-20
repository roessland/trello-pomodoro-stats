# Pomodoro statistics for Trello #

This tool parses a list of cards on [Trello](http://trello.com), looking for
certain comments designating Pomodoro sessions, and generates statistics from
this data.


For up-to-date information on development, see [the development
board](https://trello.com/board/trello-pomodoro-statistics-development/4f6670420677011f3c7b4953).


## The system ##

When you have finished a Pomodoro session related to a card, add a comment
starting with the string "Pomodoro #" (case sensitive), and then positive
integer less than 100.

When finishing the first pomodoro for this task, comment

    Pomodoro #1 was good and uninterrupted. I can write whatever I want here.

If you don't want sit in front of your computer doing pomodoros, that's fine.
Just add the number of the last pomodoro you did, and the program will assume
you did all pomodoros up to that number.

    Pomodoro #7 went fine.

The program will now assume you did pomodoro #2-6 at the same time you did #7,
so for accurate statistics, add them continuously. If there is a need for it, I
will add the ability to add the time a pomodoro was done to the comment. Like
this:

    Pomodoro #8 2011-20-03 15:30 could have been done some other day.
    Pomodoro #9 12:30 was done today.


## The statistics ##

These are planned features not currently working. See the [hosted
site](http://roessland.com/trello-pomodoro-stats)

* Total amount of pomodoros finished
* Average amount of pomodoros done per day, from you did your first pomodoro on
  this board, to the most recent.
* When you are doing most work (weekdays, hours, etc)
* Awesome graphs

## The limitations ##

The JSON file exported from Trello doesn't contain the label names or label
IDs. Tell me if you have a workaround. (Synergy with API maybe?)

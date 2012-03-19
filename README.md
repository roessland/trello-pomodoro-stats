# Pomodoro statistics for Trello #

This tool parses a list of cards on [Trello](http://trello.com), looking for
certain comments designating Pomodoro sessions, and generates statistics from
this data.


For up-to-date information on development, see [the development
board](https://trello.com/board/trello-pomodoro-statistics-development/4f6670420677011f3c7b4953).


## The system ##

When you have finished a Pomodoro session related to a card, add a comment
starting with the string "Pomodoro #" (case sensitive).

When finishing the first pomodoro for this task, comment

    Pomodoro #1 was good and uninterrupted. I can write whatever I want here.

and for the next pomodoro, comment

    Pomodoro #2 went fine.

When you are finished, move the card to a list containing completed tasks.

## The statistics ##

These are planned features not currently working. See the [hosted
site](http://roessland.com/trello-pomodoro-stats)

* Total amount of pomodoros finished
* Average amount of pomodoros done per day, from you did your first pomodoro on
  this board, to the most recent.
* When you are doing most work (weekdays, hours, etc)
* Awesome graphs

## Limitations ##

The JSON file exported from Trello doesn't contain the label names or label
IDs. Tell me if you have a workaround. (Synergy with API maybe?)

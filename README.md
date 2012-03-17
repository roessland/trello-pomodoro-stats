# Pomodoro statistics for Trello #

This tool parses a list of cards on [Trello](http://trello.com), looking for
certain comments designating Pomodoro sessions, and generates statistics from
this data.


## The system ##

When you have finished a Pomodoro session related to a card, add a comment with
the current number of finished pomodoros for this card, and then the string ```
pomodoro ```.

When finishing the first pomodoro for this task, comment

    1 pomodoro

    Whatever you want here.

and for the next pomodoro, comment

    2 pomodoro

    Whatever you want here.

When you are finished, move the card to a list containing completed tasks.

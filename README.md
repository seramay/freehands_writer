# README

# freehands writer DB design
## posts table
|column|Type|Option|
|------|----|------|
|title|string|null:false|
|content|text|null:false|
|image|text||
## Association
- none
## validates
- title, presence: true
- content, presence: true
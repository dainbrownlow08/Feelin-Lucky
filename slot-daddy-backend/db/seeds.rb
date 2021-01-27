# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Game.delete_all
Player.delete_all

x = Player.create(username: 'Zoe')
y = Player.create(username: 'DainBrownlow')

g1 = Game.create(score: 950, player_id: y.id)
g2 = Game.create(score: 2000, player_id: y.id)
class Game < ApplicationRecord
  belongs_to :player

  def self.topTen
    arr = Game.all.select{|game| game.score != nil}
    arr.sort_by{|g| g.score}.reverse.first(10)
    arr
  end
  
end

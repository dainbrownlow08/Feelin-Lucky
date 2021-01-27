class Game < ApplicationRecord
  belongs_to :player

  def self.topTen
    Game.all.sort_by{|g| g.score}.reverse.first(10)
  end
end

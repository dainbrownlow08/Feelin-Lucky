class Player < ApplicationRecord
    has_many :games
    has_many :tokens

    validates_uniqueness_of :username
end

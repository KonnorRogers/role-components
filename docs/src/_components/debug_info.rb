class DebugInfo < Bridgetown::Component
  def initialize(*elements)
    super()
    @elements = elements.flatten(1)
  end
end

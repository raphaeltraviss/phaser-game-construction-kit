export interface Component<TargetType> {
  attach(owner: TargetType);
  update(owner: TargetType);
  detach(owner: TargetType);
}

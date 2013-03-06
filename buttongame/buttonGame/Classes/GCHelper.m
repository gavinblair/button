//
//  GCHelper.m
//  buttonGame
//
//  Created by podcast on 13-03-05.
//
//

#import "GCHelper.h"
#import "MainViewController.h"
#import "AppDelegate.h"

NSString *javascriptMessage = @"";

@implementation GCHelper

@synthesize gameCenterAvailable;
@synthesize userAuthenticated;
@synthesize presentingViewController;
@synthesize match;
@synthesize matchStarted;
@synthesize delegate;
@synthesize playersDict;

#pragma mark Initialization

static GCHelper *sharedHelper = nil;
+ (GCHelper *) sharedInstance {
    if (!sharedHelper) {
        sharedHelper = [[GCHelper alloc] init];
    }
    return sharedHelper;
}

- (void)sendData:(NSData *)data {
    NSError *error;
    BOOL success = [[GCHelper sharedInstance].match sendDataToAllPlayers:data withDataMode:GKMatchSendDataReliable error:&error];
    if (!success) {
        NSLog(@"Error sending init packet");
        [self matchEnded];
    }
}


- (BOOL)isGameCenterAvailable {
    // check for presence of GKLocalPlayer API
    Class gcClass = (NSClassFromString(@"GKLocalPlayer"));
    
    // check if the device is running iOS 4.1 or later
    NSString *reqSysVer = @"4.1";
    NSString *currSysVer = [[UIDevice currentDevice] systemVersion];
    BOOL osVersionSupported = ([currSysVer compare:reqSysVer
                                           options:NSNumericSearch] != NSOrderedAscending);
    
    return (gcClass && osVersionSupported);
}

- (id)init {
    if ((self = [super init])) {
        gameCenterAvailable = [self isGameCenterAvailable];
        javascriptMessage = @"";
        userAuthenticated = false;
        matchStarted = false;
        
        if (gameCenterAvailable) {
            NSNotificationCenter *nc =
            [NSNotificationCenter defaultCenter];
            [nc addObserver:self
                   selector:@selector(authenticationChanged)
                       name:GKPlayerAuthenticationDidChangeNotificationName
                     object:nil];
        }
    }
    return self;
}
- (void)authenticationChanged {
    
    if ([GKLocalPlayer localPlayer].isAuthenticated && !userAuthenticated) {
        NSLog(@"Authentication changed: player authenticated.");
        userAuthenticated = TRUE;
    } else if (![GKLocalPlayer localPlayer].isAuthenticated && userAuthenticated) {
        NSLog(@"Authentication changed: player not authenticated");
        userAuthenticated = FALSE;
    }
    
}

- (void)lookupPlayers {
    
    NSLog(@"Looking up %d players...", self.match.playerIDs.count);
    [GKPlayer loadPlayersForIdentifiers:self.match.playerIDs withCompletionHandler:^(NSArray *players, NSError *error) {
        
        if (error != nil) {
            NSLog(@"Error retrieving player info: %@", error.localizedDescription);
            matchStarted = NO;
            [delegate matchEnded];
        } else {
            
            // Populate players dict
            self.playersDict = [NSMutableDictionary dictionaryWithCapacity:players.count];
            for (GKPlayer *player in players) {
                NSLog(@"Found player: %@", player.alias);
                [playersDict setObject:player forKey:player.playerID];
            }
            
            // Notify delegate match can begin
            matchStarted = YES;
            javascriptMessage = @"Match Started";
            [delegate matchHasStarted];
            
        }
    }];
    
}

#pragma mark User functions

- (void)authenticateLocalUser {
    
    if (!gameCenterAvailable) return;
    
    NSLog(@"Authenticating local user...");
    if ([GKLocalPlayer localPlayer].authenticated == NO) {
        [[GKLocalPlayer localPlayer] authenticateWithCompletionHandler:nil];
    } else {
        NSLog(@"Already authenticated!");
    }
}

- (void)findMatchWithMinPlayers:(int)minPlayers maxPlayers:(int)maxPlayers
                 viewController:(UIViewController *)viewController
                       delegate:(id<GCHelperDelegate>)theDelegate {
    
    if (!gameCenterAvailable) return;
    
    matchStarted = NO;
    self.match = nil;
    self.presentingViewController = viewController;
    delegate = theDelegate;
    [presentingViewController dismissModalViewControllerAnimated:NO];
    
    GKMatchRequest *request = [[[GKMatchRequest alloc] init] autorelease];
    request.minPlayers = minPlayers;
    request.maxPlayers = maxPlayers;
    
    GKMatchmakerViewController *mmvc =
    [[[GKMatchmakerViewController alloc] initWithMatchRequest:request] autorelease];
    mmvc.matchmakerDelegate = self;
    
    [presentingViewController presentModalViewController:mmvc animated:YES];
    
}

#pragma mark GKMatchmakerViewControllerDelegate

// The user has cancelled matchmaking
- (void)matchmakerViewControllerWasCancelled:(GKMatchmakerViewController *)viewController {
    [presentingViewController dismissModalViewControllerAnimated:YES];
}

// Matchmaking has failed with an error
- (void)matchmakerViewController:(GKMatchmakerViewController *)viewController didFailWithError:(NSError *)error {
    [presentingViewController dismissModalViewControllerAnimated:YES];
    NSLog(@"Error finding match: %@", error.localizedDescription);
    javascriptMessage = @"Error finding match";
}

// A peer-to-peer match has been found, the game should start
- (void)matchmakerViewController:(GKMatchmakerViewController *)viewController didFindMatch:(GKMatch *)theMatch {
    [presentingViewController dismissModalViewControllerAnimated:YES];
    self.match = theMatch;
    match.delegate = self;
    if (!matchStarted && match.expectedPlayerCount == 0) {
        NSLog(@"nslog Ready to start match!");
        javascriptMessage = @"Ready to start match!";
        [self lookupPlayers];
    }
}

#pragma mark GKMatchDelegate



// The player state changed (eg. connected or disconnected)
- (void)match:(GKMatch *)theMatch player:(NSString *)playerID didChangeState:(GKPlayerConnectionState)state {
    if (match != theMatch) return;
    
    switch (state) {
        case GKPlayerStateConnected:
            // handle a new player connection.
            NSLog(@"Player connected!");
            javascriptMessage = @"Player connected";
            
            if (!matchStarted && theMatch.expectedPlayerCount == 0) {
                NSLog(@"nslog2 Ready to start match!");
                javascriptMessage = @"2 Ready to start match!";
                [self lookupPlayers];
            }
            
            break;
        case GKPlayerStateDisconnected:
            // a player just disconnected.
            NSLog(@"Player disconnected!");
            javascriptMessage = @"Player disconnected";
            matchStarted = NO;
            [delegate matchEnded];
            break;
    }
}

// on "dealloc" you need to release all your retained objects
- (void) dealloc
{
	// in case you have something to dealloc, do it in this method
	// in this particular example nothing needs to be released.
	// cocos2d will automatically release all the children (Label)
    [otherPlayerID release];
    otherPlayerID = nil;
    
    //[sharedHelper release];
    
	// don't forget to call "super dealloc"
	[super dealloc];
}

// The match was unable to connect with the player due to an error.
- (void)match:(GKMatch *)theMatch connectionWithPlayerFailed:(NSString *)playerID withError:(NSError *)error {
    
    if (match != theMatch) return;
    
    NSLog(@"Failed to connect to player with error: %@", error.localizedDescription);
    javascriptMessage = @"Failed to connect to player with error";
    matchStarted = NO;
    [delegate matchEnded];
}

// The match was unable to be established with any players due to an error.
- (void)match:(GKMatch *)theMatch didFailWithError:(NSError *)error {
    
    if (match != theMatch) return;
    
    NSLog(@"Match failed with error: %@", error.localizedDescription);
    javascriptMessage = @"Match failed with error";
    matchStarted = NO;
    [delegate matchEnded];
}

- (void)matchHasStarted {
    NSLog(@"Match started");
    javascriptMessage = @"Match started";
    
}

- (void)matchEnded {
    NSLog(@"Match ended");
    javascriptMessage = @"Match ended";
    
    // Disconnects match and ends level
    [[GCHelper sharedInstance].match disconnect];
    [GCHelper sharedInstance].match = nil;
}

- (void)getMatch:(CDVInvokedUrlCommand*)command
{
    
    AppDelegate * delegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
    [[GCHelper sharedInstance] findMatchWithMinPlayers:2 maxPlayers:2 viewController:delegate.viewController delegate:self];
    
}

- (void)getMessage:(CDVInvokedUrlCommand*)command{
    CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:javascriptMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)sendMessage:(CDVInvokedUrlCommand*)command{
    NSString* msg = [command.arguments objectAtIndex:0];
    
    NSLog(@"Send: %@", msg);
    
    //send data
    NSData* data = [msg dataUsingEncoding:NSUTF8StringEncoding];
    [self sendData:data];
    
    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:javascriptMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

// The match received data sent from the player.
- (void)match:(GKMatch *)match didReceiveData:(NSData *)data fromPlayer:(NSString *)playerID {
    
    // Store away other player ID for later
    if (otherPlayerID == nil) {
        otherPlayerID = [playerID retain];
    }
    
    //NSString* msg = [[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding] autorelease];
    
    
    NSString* msg = [[NSString alloc] initWithData:data
                                               encoding:NSUTF8StringEncoding] ;
    
    javascriptMessage = msg;
    NSLog(@"Received: %@", msg);
    
}




@end
